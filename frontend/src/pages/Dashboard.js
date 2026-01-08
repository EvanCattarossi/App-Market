import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import {
  TrendingUp,
  Lightbulb,
  FileText,
  BarChart3,
  ArrowRight,
  Zap,
  AlertTriangle,
  Loader2
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const mockChartData = [
  { name: "Jan", value: 4000, opportunities: 2 },
  { name: "Fév", value: 3000, opportunities: 3 },
  { name: "Mar", value: 5000, opportunities: 4 },
  { name: "Avr", value: 4500, opportunities: 3 },
  { name: "Mai", value: 6000, opportunities: 5 },
  { name: "Juin", value: 5500, opportunities: 6 },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, getAuthHeader } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/stats`, getAuthHeader());
      setStats(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 text-lime-500 animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Analyses",
      value: stats?.total_analyses || 0,
      icon: BarChart3,
      color: "text-lime-500",
      link: "/analyses"
    },
    {
      title: "Opportunités",
      value: stats?.total_opportunities || 0,
      icon: Lightbulb,
      color: "text-yellow-500",
      link: "/opportunities"
    },
    {
      title: "Rapports",
      value: stats?.total_reports || 0,
      icon: FileText,
      color: "text-purple-500",
      link: "/reports"
    },
    {
      title: "Priorité Haute",
      value: stats?.high_priority_opportunities || 0,
      icon: AlertTriangle,
      color: "text-red-500",
      link: "/opportunities"
    }
  ];

  return (
    <div className="space-y-6" data-testid="dashboard">
      {/* Header */}
      <motion.div {...fadeInUp}>
        <h1 className="font-display font-bold text-2xl lg:text-3xl mb-2">
          Bonjour, <span className="text-lime-500">{user?.full_name?.split(" ")[0]}</span>
        </h1>
        <p className="text-[#8A9E91]">
          Voici un aperçu de vos analyses de marché
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={stat.link}>
              <Card className="bg-surface border-[#1F3328] hover:border-lime-500/50 transition-colors cursor-pointer" data-testid={`stat-card-${index}`}>
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    <ArrowRight className="h-4 w-4 text-[#4A5E51]" />
                  </div>
                  <p className="font-display font-bold text-2xl lg:text-3xl">{stat.value}</p>
                  <p className="text-[#8A9E91] text-sm">{stat.title}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-surface border-[#1F3328]">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-lime-500" />
                Tendance des Opportunités
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#BDFF00" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#BDFF00" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F3328" />
                    <XAxis dataKey="name" stroke="#8A9E91" fontSize={12} />
                    <YAxis stroke="#8A9E91" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0A120E",
                        border: "1px solid #1F3328",
                        borderRadius: "0px"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="opportunities"
                      stroke="#BDFF00"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Analyses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-surface border-[#1F3328]">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-lime-500" />
                  Analyses Récentes
                </span>
                <Link to="/analyses">
                  <Button variant="ghost" size="sm" className="text-lime-500 hover:text-lime-400">
                    Voir tout
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recent_analyses?.length > 0 ? (
                <div className="space-y-3">
                  {stats.recent_analyses.slice(0, 4).map((analysis, index) => (
                    <div
                      key={analysis.id}
                      className="flex items-center justify-between p-3 bg-[#111F18] border border-[#1F3328]"
                      data-testid={`recent-analysis-${index}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{analysis.title}</p>
                        <p className="text-xs text-[#8A9E91]">{analysis.industry}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-mono ${
                          analysis.status === "completed"
                            ? "bg-lime-500/10 text-lime-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {analysis.status === "completed" ? "TERMINÉ" : "EN COURS"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Zap className="h-12 w-12 text-[#1F3328] mx-auto mb-3" />
                  <p className="text-[#8A9E91] mb-4">Aucune analyse pour le moment</p>
                  <Link to="/analyses">
                    <Button className="bg-lime-500 text-black font-bold hover:bg-lime-400">
                      Créer une analyse
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Opportunities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-surface border-[#1F3328]">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Top Opportunités
              </span>
              <Link to="/opportunities">
                <Button variant="ghost" size="sm" className="text-lime-500 hover:text-lime-400">
                  Voir tout
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.top_opportunities?.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.top_opportunities.slice(0, 3).map((opp, index) => (
                  <div
                    key={opp.id || index}
                    className="p-4 bg-[#111F18] border border-[#1F3328] hover:border-lime-500/50 transition-colors"
                    data-testid={`top-opportunity-${index}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{opp.title}</h4>
                      <span
                        className={`px-2 py-0.5 text-xs font-mono ${
                          opp.priority === "high"
                            ? "bg-red-500/10 text-red-500"
                            : opp.priority === "medium"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-green-500/10 text-green-500"
                        }`}
                      >
                        {opp.priority?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-[#8A9E91] mb-2">{opp.analysis_title}</p>
                    <p className="font-mono text-lime-500 font-bold">{opp.potential_revenue}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Lightbulb className="h-12 w-12 text-[#1F3328] mx-auto mb-3" />
                <p className="text-[#8A9E91]">Les opportunités apparaîtront après vos analyses</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
