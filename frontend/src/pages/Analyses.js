import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import {
  Plus,
  Loader2,
  BarChart3,
  Trash2,
  Eye,
  Building2,
  Target,
  Users
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const industries = [
  "Technologie",
  "E-commerce",
  "SaaS",
  "Fintech",
  "Santé",
  "Immobilier",
  "Éducation",
  "Marketing",
  "Logistique",
  "Autre"
];

const Analyses = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    industry: "",
    target_market: "",
    competitors: "",
    description: ""
  });
  const { getAuthHeader } = useAuth();

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await axios.get(`${API}/analyses`, getAuthHeader());
      setAnalyses(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des analyses");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.industry || !formData.target_market) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    setCreating(true);
    try {
      const payload = {
        ...formData,
        competitors: formData.competitors
          ? formData.competitors.split(",").map((c) => c.trim())
          : []
      };
      
      const response = await axios.post(`${API}/analyses`, payload, getAuthHeader());
      setAnalyses([response.data, ...analyses]);
      setDialogOpen(false);
      setFormData({
        title: "",
        industry: "",
        target_market: "",
        competitors: "",
        description: ""
      });
      toast.success("Analyse créée avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la création de l'analyse");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette analyse ?")) return;
    
    try {
      await axios.delete(`${API}/analyses/${id}`, getAuthHeader());
      setAnalyses(analyses.filter((a) => a.id !== id));
      toast.success("Analyse supprimée");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const openDetails = (analysis) => {
    setSelectedAnalysis(analysis);
    setDetailsOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 text-lime-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="analyses-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl lg:text-3xl">Analyses de Marché</h1>
          <p className="text-[#8A9E91]">Créez et gérez vos analyses stratégiques</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-lime-500 text-black font-bold hover:bg-lime-400" data-testid="create-analysis-btn">
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle Analyse
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-surface border-[#1F3328] max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">Créer une Analyse</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'analyse *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Analyse marché SaaS B2B France"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-background border-[#1F3328] focus:border-lime-500"
                  data-testid="analysis-title-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industrie *</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger className="bg-background border-[#1F3328]" data-testid="analysis-industry-select">
                    <SelectValue placeholder="Sélectionnez une industrie" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-[#1F3328]">
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_market">Marché cible *</Label>
                <Input
                  id="target_market"
                  placeholder="Ex: PME françaises 10-50 employés"
                  value={formData.target_market}
                  onChange={(e) => setFormData({ ...formData, target_market: e.target.value })}
                  className="bg-background border-[#1F3328] focus:border-lime-500"
                  data-testid="analysis-market-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="competitors">Concurrents (séparés par virgule)</Label>
                <Input
                  id="competitors"
                  placeholder="Ex: Concurrent1, Concurrent2"
                  value={formData.competitors}
                  onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
                  className="bg-background border-[#1F3328] focus:border-lime-500"
                  data-testid="analysis-competitors-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description additionnelle</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre projet ou contexte..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-background border-[#1F3328] focus:border-lime-500 min-h-[100px]"
                  data-testid="analysis-description-input"
                />
              </div>

              <Button
                type="submit"
                disabled={creating}
                className="w-full bg-lime-500 text-black font-bold hover:bg-lime-400"
                data-testid="submit-analysis-btn"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  "Lancer l'Analyse IA"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Analyses Grid */}
      {analyses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyses.map((analysis, index) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-surface border-[#1F3328] hover:border-lime-500/50 transition-colors h-full" data-testid={`analysis-card-${index}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="font-display text-base">{analysis.title}</CardTitle>
                    <span
                      className={`px-2 py-0.5 text-xs font-mono ${
                        analysis.status === "completed"
                          ? "bg-lime-500/10 text-lime-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {analysis.status === "completed" ? "TERMINÉ" : "EN COURS"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-[#8A9E91]">
                      <Building2 className="h-4 w-4" />
                      <span>{analysis.industry}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#8A9E91]">
                      <Target className="h-4 w-4" />
                      <span className="truncate">{analysis.target_market}</span>
                    </div>
                    {analysis.competitors?.length > 0 && (
                      <div className="flex items-center gap-2 text-[#8A9E91]">
                        <Users className="h-4 w-4" />
                        <span>{analysis.competitors.length} concurrent(s)</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#1F3328]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-[#8A9E91] hover:text-lime-500"
                      onClick={() => openDetails(analysis)}
                      data-testid={`view-analysis-${index}`}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Détails
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#8A9E91] hover:text-destructive"
                      onClick={() => handleDelete(analysis.id)}
                      data-testid={`delete-analysis-${index}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="bg-surface border-[#1F3328]">
          <CardContent className="py-16 text-center">
            <BarChart3 className="h-16 w-16 text-[#1F3328] mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl mb-2">Aucune analyse</h3>
            <p className="text-[#8A9E91] mb-6">
              Créez votre première analyse pour découvrir les opportunités de votre marché
            </p>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-lime-500 text-black font-bold hover:bg-lime-400"
            >
              <Plus className="h-5 w-5 mr-2" />
              Créer une analyse
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="bg-surface border-[#1F3328] max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{selectedAnalysis?.title}</DialogTitle>
          </DialogHeader>
          {selectedAnalysis && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#111F18] border border-[#1F3328]">
                  <p className="text-xs text-[#8A9E91] mb-1">Industrie</p>
                  <p className="font-medium">{selectedAnalysis.industry}</p>
                </div>
                <div className="p-3 bg-[#111F18] border border-[#1F3328]">
                  <p className="text-xs text-[#8A9E91] mb-1">Marché cible</p>
                  <p className="font-medium">{selectedAnalysis.target_market}</p>
                </div>
              </div>

              {selectedAnalysis.competitors?.length > 0 && (
                <div>
                  <h4 className="font-display font-bold mb-2">Concurrents analysés</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnalysis.competitors.map((c, i) => (
                      <span key={i} className="px-3 py-1 bg-[#111F18] border border-[#1F3328] text-sm">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedAnalysis.ai_insights && (
                <div>
                  <h4 className="font-display font-bold mb-2 flex items-center gap-2">
                    <span className="text-lime-500">●</span>
                    Insights IA
                  </h4>
                  <div className="p-4 bg-[#111F18] border border-[#1F3328] whitespace-pre-wrap text-sm text-[#8A9E91]">
                    {selectedAnalysis.ai_insights}
                  </div>
                </div>
              )}

              {selectedAnalysis.opportunities?.length > 0 && (
                <div>
                  <h4 className="font-display font-bold mb-2">Opportunités détectées</h4>
                  <div className="space-y-2">
                    {selectedAnalysis.opportunities.map((opp, i) => (
                      <div key={i} className="p-3 bg-[#111F18] border border-[#1F3328]">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{opp.title}</p>
                          <span className="font-mono text-lime-500 text-sm">{opp.potential_revenue}</span>
                        </div>
                        <p className="text-xs text-[#8A9E91]">{opp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Analyses;
