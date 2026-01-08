# MarketPulse AI - Product Requirements Document

## Original Problem Statement
Construire une application qui génère un maximum de revenu basée sur l'analyse du marché pour les entreprises et qui leur trouve les meilleures opportunités.

## User Personas
1. **Entrepreneur** - Cherche à identifier les opportunités de marché pour sa startup
2. **Analyste Business** - A besoin de rapports détaillés pour présenter aux investisseurs
3. **PME** - Veut comprendre la concurrence et trouver des niches

## Core Requirements
- Analyse de marché assistée par IA (GPT-5.2)
- Détection automatique d'opportunités
- Génération de rapports professionnels
- Modèle freemium avec abonnements
- Interface utilisateur intuitive et professionnelle

## Architecture
- **Frontend**: React + TailwindCSS + Shadcn UI + Framer Motion
- **Backend**: FastAPI + MongoDB + emergentintegrations
- **AI**: GPT-5.2 via Emergent LLM Key
- **Auth**: JWT tokens

## What's Been Implemented (2025-01-08)

### Backend
- User authentication (register/login) with JWT
- Market analysis CRUD with AI insights generation
- Opportunities detection from analyses
- AI-powered report generation (3 types)
- Dashboard stats aggregation

### Frontend
- Landing page with pricing tiers
- User registration/login flows
- Dashboard with stats + charts
- Analyses management page
- Opportunities listing page
- Reports generation page
- Responsive design with "Toxic Wealth" theme

## Prioritized Backlog

### P0 (Done)
- [x] User authentication
- [x] Analysis creation with AI
- [x] Reports generation
- [x] Dashboard stats

### P1 (Next)
- [ ] User subscription management (Stripe integration)
- [ ] Email notifications for new opportunities
- [ ] PDF export for reports
- [ ] Analysis sharing between team members

### P2 (Future)
- [ ] Real-time market data integration (Alpha Vantage)
- [ ] Advanced competitor tracking
- [ ] Custom alerts configuration
- [ ] API access for enterprise users

## Next Tasks
1. Integrate Stripe for subscription payments
2. Add PDF export functionality for reports
3. Implement email alerts for high-priority opportunities
4. Add user profile/settings page
