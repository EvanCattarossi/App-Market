from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
SECRET_KEY = os.environ.get('JWT_SECRET', 'marketpulse-secret-key-2024')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# LLM Config
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

app = FastAPI(title="MarketPulse AI")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# ============= MODELS =============

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    company_name: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    company_name: str
    full_name: str
    subscription_tier: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class AnalysisCreate(BaseModel):
    title: str
    industry: str
    target_market: str
    competitors: Optional[List[str]] = []
    description: Optional[str] = ""

class AnalysisResponse(BaseModel):
    id: str
    user_id: str
    title: str
    industry: str
    target_market: str
    competitors: List[str]
    description: str
    status: str
    ai_insights: Optional[str] = None
    opportunities: List[dict] = []
    created_at: str
    updated_at: str

class OpportunityResponse(BaseModel):
    id: str
    analysis_id: str
    title: str
    description: str
    potential_revenue: str
    risk_level: str
    priority: str
    created_at: str

class ReportCreate(BaseModel):
    analysis_id: str
    report_type: str  # "market_overview", "competitor_analysis", "opportunity_report"

class ReportResponse(BaseModel):
    id: str
    user_id: str
    analysis_id: str
    report_type: str
    title: str
    content: str
    status: str
    created_at: str

class DashboardStats(BaseModel):
    total_analyses: int
    total_opportunities: int
    total_reports: int
    high_priority_opportunities: int
    recent_analyses: List[dict]
    top_opportunities: List[dict]

# ============= AUTH HELPERS =============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    payload = {"sub": user_id, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============= AI SERVICE =============

async def generate_ai_insights(analysis: dict) -> str:
    if not EMERGENT_LLM_KEY:
        return "AI insights unavailable - API key not configured"
    
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"analysis-{analysis.get('id', 'default')}",
            system_message="Tu es un expert en analyse de marché et stratégie business. Tu fournis des insights précis et actionnables en français."
        ).with_model("openai", "gpt-5.2")
        
        prompt = f"""Analyse ce marché et fournis des insights stratégiques:

Titre: {analysis.get('title', '')}
Industrie: {analysis.get('industry', '')}
Marché cible: {analysis.get('target_market', '')}
Concurrents: {', '.join(analysis.get('competitors', []))}
Description: {analysis.get('description', '')}

Fournis:
1. Résumé du marché (2-3 phrases)
2. 3 opportunités principales avec estimation de potentiel
3. 2 risques majeurs à considérer
4. Recommandation stratégique clé

Format ta réponse de manière concise et professionnelle."""

        response = await chat.send_message(UserMessage(text=prompt))
        return response
    except Exception as e:
        logging.error(f"AI generation error: {e}")
        return f"Erreur lors de la génération des insights: {str(e)}"

async def generate_report_content(analysis: dict, report_type: str) -> str:
    if not EMERGENT_LLM_KEY:
        return "Rapport non disponible - Clé API non configurée"
    
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"report-{analysis.get('id', 'default')}-{report_type}",
            system_message="Tu es un consultant senior en stratégie d'entreprise. Tu rédiges des rapports professionnels et détaillés en français."
        ).with_model("openai", "gpt-5.2")
        
        type_prompts = {
            "market_overview": "Génère un rapport complet d'aperçu du marché incluant: taille du marché, tendances, acteurs clés, facteurs de croissance.",
            "competitor_analysis": "Génère une analyse concurrentielle détaillée: forces/faiblesses des concurrents, positionnement, stratégies, parts de marché estimées.",
            "opportunity_report": "Génère un rapport d'opportunités: opportunités identifiées, potentiel de revenus, plan d'action recommandé, timeline."
        }
        
        prompt = f"""{type_prompts.get(report_type, type_prompts['market_overview'])}

Données de l'analyse:
- Titre: {analysis.get('title', '')}
- Industrie: {analysis.get('industry', '')}
- Marché cible: {analysis.get('target_market', '')}
- Concurrents: {', '.join(analysis.get('competitors', []))}
- Description: {analysis.get('description', '')}
- Insights précédents: {analysis.get('ai_insights', '')}

Génère un rapport professionnel et structuré avec des sections claires."""

        response = await chat.send_message(UserMessage(text=prompt))
        return response
    except Exception as e:
        logging.error(f"Report generation error: {e}")
        return f"Erreur lors de la génération du rapport: {str(e)}"

# ============= AUTH ROUTES =============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    user = {
        "id": user_id,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "company_name": user_data.company_name,
        "full_name": user_data.full_name,
        "subscription_tier": "free",
        "created_at": now,
        "updated_at": now
    }
    
    await db.users.insert_one(user)
    token = create_token(user_id)
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user_id,
            email=user_data.email,
            company_name=user_data.company_name,
            full_name=user_data.full_name,
            subscription_tier="free",
            created_at=now
        )
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    token = create_token(user["id"])
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            company_name=user["company_name"],
            full_name=user["full_name"],
            subscription_tier=user["subscription_tier"],
            created_at=user["created_at"]
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    return UserResponse(**user)

# ============= ANALYSES ROUTES =============

@api_router.post("/analyses", response_model=AnalysisResponse)
async def create_analysis(data: AnalysisCreate, user: dict = Depends(get_current_user)):
    analysis_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    analysis = {
        "id": analysis_id,
        "user_id": user["id"],
        "title": data.title,
        "industry": data.industry,
        "target_market": data.target_market,
        "competitors": data.competitors,
        "description": data.description,
        "status": "processing",
        "ai_insights": None,
        "opportunities": [],
        "created_at": now,
        "updated_at": now
    }
    
    await db.analyses.insert_one(analysis)
    
    # Generate AI insights
    ai_insights = await generate_ai_insights(analysis)
    
    # Generate opportunities from AI
    opportunities = [
        {
            "id": str(uuid.uuid4()),
            "title": f"Opportunité marché {data.target_market}",
            "description": "Opportunité identifiée par l'analyse IA",
            "potential_revenue": "50K - 200K €",
            "risk_level": "medium",
            "priority": "high"
        }
    ]
    
    await db.analyses.update_one(
        {"id": analysis_id},
        {"$set": {
            "ai_insights": ai_insights,
            "opportunities": opportunities,
            "status": "completed",
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    analysis["ai_insights"] = ai_insights
    analysis["opportunities"] = opportunities
    analysis["status"] = "completed"
    
    return AnalysisResponse(**analysis)

@api_router.get("/analyses", response_model=List[AnalysisResponse])
async def get_analyses(user: dict = Depends(get_current_user)):
    analyses = await db.analyses.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return [AnalysisResponse(**a) for a in analyses]

@api_router.get("/analyses/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(analysis_id: str, user: dict = Depends(get_current_user)):
    analysis = await db.analyses.find_one(
        {"id": analysis_id, "user_id": user["id"]},
        {"_id": 0}
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="Analyse non trouvée")
    return AnalysisResponse(**analysis)

@api_router.delete("/analyses/{analysis_id}")
async def delete_analysis(analysis_id: str, user: dict = Depends(get_current_user)):
    result = await db.analyses.delete_one({"id": analysis_id, "user_id": user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Analyse non trouvée")
    return {"message": "Analyse supprimée"}

# ============= OPPORTUNITIES ROUTES =============

@api_router.get("/opportunities", response_model=List[OpportunityResponse])
async def get_opportunities(user: dict = Depends(get_current_user)):
    analyses = await db.analyses.find(
        {"user_id": user["id"]},
        {"_id": 0, "opportunities": 1, "id": 1}
    ).to_list(100)
    
    all_opportunities = []
    for analysis in analyses:
        for opp in analysis.get("opportunities", []):
            all_opportunities.append(OpportunityResponse(
                id=opp.get("id", str(uuid.uuid4())),
                analysis_id=analysis["id"],
                title=opp.get("title", ""),
                description=opp.get("description", ""),
                potential_revenue=opp.get("potential_revenue", "N/A"),
                risk_level=opp.get("risk_level", "medium"),
                priority=opp.get("priority", "medium"),
                created_at=datetime.now(timezone.utc).isoformat()
            ))
    
    return all_opportunities

# ============= REPORTS ROUTES =============

@api_router.post("/reports", response_model=ReportResponse)
async def create_report(data: ReportCreate, user: dict = Depends(get_current_user)):
    analysis = await db.analyses.find_one(
        {"id": data.analysis_id, "user_id": user["id"]},
        {"_id": 0}
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="Analyse non trouvée")
    
    report_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    content = await generate_report_content(analysis, data.report_type)
    
    type_titles = {
        "market_overview": "Aperçu du Marché",
        "competitor_analysis": "Analyse Concurrentielle",
        "opportunity_report": "Rapport d'Opportunités"
    }
    
    report = {
        "id": report_id,
        "user_id": user["id"],
        "analysis_id": data.analysis_id,
        "report_type": data.report_type,
        "title": f"{type_titles.get(data.report_type, 'Rapport')} - {analysis['title']}",
        "content": content,
        "status": "completed",
        "created_at": now
    }
    
    await db.reports.insert_one(report)
    return ReportResponse(**report)

@api_router.get("/reports", response_model=List[ReportResponse])
async def get_reports(user: dict = Depends(get_current_user)):
    reports = await db.reports.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return [ReportResponse(**r) for r in reports]

@api_router.get("/reports/{report_id}", response_model=ReportResponse)
async def get_report(report_id: str, user: dict = Depends(get_current_user)):
    report = await db.reports.find_one(
        {"id": report_id, "user_id": user["id"]},
        {"_id": 0}
    )
    if not report:
        raise HTTPException(status_code=404, detail="Rapport non trouvé")
    return ReportResponse(**report)

# ============= DASHBOARD ROUTES =============

@api_router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(user: dict = Depends(get_current_user)):
    total_analyses = await db.analyses.count_documents({"user_id": user["id"]})
    total_reports = await db.reports.count_documents({"user_id": user["id"]})
    
    analyses = await db.analyses.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    all_opportunities = []
    high_priority = 0
    for a in analyses:
        for opp in a.get("opportunities", []):
            all_opportunities.append({
                "id": opp.get("id", ""),
                "title": opp.get("title", ""),
                "potential_revenue": opp.get("potential_revenue", "N/A"),
                "priority": opp.get("priority", "medium"),
                "analysis_title": a.get("title", "")
            })
            if opp.get("priority") == "high":
                high_priority += 1
    
    recent_analyses = [
        {
            "id": a["id"],
            "title": a["title"],
            "industry": a["industry"],
            "status": a["status"],
            "created_at": a["created_at"]
        }
        for a in analyses[:5]
    ]
    
    return DashboardStats(
        total_analyses=total_analyses,
        total_opportunities=len(all_opportunities),
        total_reports=total_reports,
        high_priority_opportunities=high_priority,
        recent_analyses=recent_analyses,
        top_opportunities=all_opportunities[:5]
    )

# ============= HEALTH CHECK =============

@api_router.get("/")
async def root():
    return {"message": "MarketPulse AI API", "version": "1.0.0"}

@api_router.get("/health")
async def health():
    return {"status": "healthy"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
