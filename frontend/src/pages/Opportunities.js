import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Loader2,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  ArrowRight,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const priorityConfig = {
  high: { label: "Haute", color: "bg-red-500/10 text-red-500 border-red-500/20" },
  medium: { label: "Moyenne", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  low: { label: "Basse", color: "bg-green-500/10 text-green-500 border-green-500/20" }
};

const riskConfig = {
  high: { label: "Élevé", color: "text-red-500" },
  medium: { label: "Modéré", color: "text-yellow-500" },
  low: { label: "Faible", color: "text-green-500" }
};

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { getAuthHeader } = useAuth();

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await axios.get(`${API}/opportunities`, getAuthHeader());
      setOpportunities(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des opportunités");
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    if (filter === "all") return true;
    return opp.priority === filter;
  });

  const stats = {
    total: opportunities.length,
    high: opportunities.filter((o) => o.priority === "high").length,
    medium: opportunities.filter((o) => o.priority === "medium").length,
    low: opportunities.filter((o) => o.priority === "low").length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 text-lime-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="opportunities-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl lg:text-3xl">Opportunités</h1>
          <p className="text-[#8A9E91]">Opportunités détectées par l'analyse IA</p>
        </div>

        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-[#8A9E91]" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px] bg-surface border-[#1F3328]" data-testid="priority-filter">
              <SelectValue placeholder="Filtrer" />
            </SelectTrigger>
            <SelectContent className="bg-surface border-[#1F3328]">
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="high">Priorité haute</SelectItem>
              <SelectItem value="medium">Priorité moyenne</SelectItem>
              <SelectItem value="low">Priorité basse</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-surface border-[#1F3328]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-lime-500/10 flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-lime-500" />
              </div>
              <div>
                <p className="font-display font-bold text-2xl">{stats.total}</p>
                <p className="text-xs text-[#8A9E91]">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface border-[#1F3328]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="font-display font-bold text-2xl">{stats.high}</p>
                <p className="text-xs text-[#8A9E91]">Haute priorité</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface border-[#1F3328]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="font-display font-bold text-2xl">{stats.medium}</p>
                <p className="text-xs text-[#8A9E91]">Moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface border-[#1F3328]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-display font-bold text-2xl">{stats.low}</p>
                <p className="text-xs text-[#8A9E91]">Basse</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Opportunities List */}
      {filteredOpportunities.length > 0 ? (
        <div className="space-y-4">
          {filteredOpportunities.map((opp, index) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-surface border-[#1F3328] hover:border-lime-500/50 transition-colors" data-testid={`opportunity-card-${index}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-display font-bold text-lg">{opp.title}</h3>
                        <span className={`px-2 py-0.5 text-xs font-mono border ${priorityConfig[opp.priority]?.color || priorityConfig.medium.color}`}>
                          {priorityConfig[opp.priority]?.label || "Moyenne"}
                        </span>
                      </div>
                      <p className="text-[#8A9E91] text-sm">{opp.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <p className="text-xs text-[#8A9E91] mb-1">Potentiel Revenu</p>
                        <p className="font-mono font-bold text-lime-500">{opp.potential_revenue}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#8A9E91] mb-1">Niveau de risque</p>
                        <p className={`font-medium ${riskConfig[opp.risk_level]?.color || "text-yellow-500"}`}>
                          {riskConfig[opp.risk_level]?.label || "Modéré"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-lime-500 hover:text-lime-400"
                      >
                        Explorer
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="bg-surface border-[#1F3328]">
          <CardContent className="py-16 text-center">
            <Lightbulb className="h-16 w-16 text-[#1F3328] mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl mb-2">Aucune opportunité</h3>
            <p className="text-[#8A9E91] mb-6">
              Les opportunités apparaîtront après vos analyses de marché
            </p>
            <Link to="/analyses">
              <Button className="bg-lime-500 text-black font-bold hover:bg-lime-400">
                Créer une analyse
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Opportunities;
