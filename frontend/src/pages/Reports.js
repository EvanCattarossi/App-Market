import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
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
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Loader2,
  FileText,
  Plus,
  Eye,
  Download,
  BarChart3,
  Users,
  Lightbulb,
  Calendar
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const reportTypes = [
  { value: "market_overview", label: "Aperçu du Marché", icon: BarChart3 },
  { value: "competitor_analysis", label: "Analyse Concurrentielle", icon: Users },
  { value: "opportunity_report", label: "Rapport d'Opportunités", icon: Lightbulb }
];

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [formData, setFormData] = useState({
    analysis_id: "",
    report_type: ""
  });
  const { getAuthHeader } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reportsRes, analysesRes] = await Promise.all([
        axios.get(`${API}/reports`, getAuthHeader()),
        axios.get(`${API}/analyses`, getAuthHeader())
      ]);
      setReports(reportsRes.data);
      setAnalyses(analysesRes.data);
    } catch (error) {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.analysis_id || !formData.report_type) {
      toast.error("Veuillez sélectionner une analyse et un type de rapport");
      return;
    }

    setCreating(true);
    try {
      const response = await axios.post(`${API}/reports`, formData, getAuthHeader());
      setReports([response.data, ...reports]);
      setDialogOpen(false);
      setFormData({ analysis_id: "", report_type: "" });
      toast.success("Rapport généré avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la génération du rapport");
    } finally {
      setCreating(false);
    }
  };

  const openReport = (report) => {
    setSelectedReport(report);
    setViewOpen(true);
  };

  const getReportIcon = (type) => {
    const config = reportTypes.find((t) => t.value === type);
    return config?.icon || FileText;
  };

  const getReportLabel = (type) => {
    const config = reportTypes.find((t) => t.value === type);
    return config?.label || "Rapport";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 text-lime-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="reports-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl lg:text-3xl">Rapports IA</h1>
          <p className="text-[#8A9E91]">Rapports générés par intelligence artificielle</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-lime-500 text-black font-bold hover:bg-lime-400"
              disabled={analyses.length === 0}
              data-testid="create-report-btn"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouveau Rapport
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-surface border-[#1F3328]">
            <DialogHeader>
              <DialogTitle className="font-display">Générer un Rapport</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Analyse source</Label>
                <Select
                  value={formData.analysis_id}
                  onValueChange={(value) => setFormData({ ...formData, analysis_id: value })}
                >
                  <SelectTrigger className="bg-background border-[#1F3328]" data-testid="report-analysis-select">
                    <SelectValue placeholder="Sélectionnez une analyse" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-[#1F3328]">
                    {analyses.map((analysis) => (
                      <SelectItem key={analysis.id} value={analysis.id}>
                        {analysis.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type de rapport</Label>
                <Select
                  value={formData.report_type}
                  onValueChange={(value) => setFormData({ ...formData, report_type: value })}
                >
                  <SelectTrigger className="bg-background border-[#1F3328]" data-testid="report-type-select">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-[#1F3328]">
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={creating}
                className="w-full bg-lime-500 text-black font-bold hover:bg-lime-400"
                data-testid="submit-report-btn"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  "Générer le Rapport"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reports Grid */}
      {reports.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report, index) => {
            const Icon = getReportIcon(report.report_type);
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-surface border-[#1F3328] hover:border-lime-500/50 transition-colors h-full" data-testid={`report-card-${index}`}>
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-lime-500/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-lime-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-sm mb-1 truncate">{report.title}</h3>
                        <p className="text-xs text-[#8A9E91]">{getReportLabel(report.report_type)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#8A9E91] mb-4">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(report.created_at).toLocaleDateString("fr-FR")}</span>
                    </div>

                    <div className="mt-auto flex items-center gap-2 pt-4 border-t border-[#1F3328]">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-[#8A9E91] hover:text-lime-500"
                        onClick={() => openReport(report)}
                        data-testid={`view-report-${index}`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Lire
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#8A9E91] hover:text-lime-500"
                        onClick={() => {
                          const blob = new Blob([report.content], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${report.title}.txt`;
                          a.click();
                          toast.success("Rapport téléchargé");
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="bg-surface border-[#1F3328]">
          <CardContent className="py-16 text-center">
            <FileText className="h-16 w-16 text-[#1F3328] mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl mb-2">Aucun rapport</h3>
            <p className="text-[#8A9E91] mb-6">
              {analyses.length === 0
                ? "Créez d'abord une analyse pour générer des rapports"
                : "Générez votre premier rapport IA basé sur vos analyses"
              }
            </p>
            {analyses.length === 0 ? (
              <Link to="/analyses">
                <Button className="bg-lime-500 text-black font-bold hover:bg-lime-400">
                  Créer une analyse
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-lime-500 text-black font-bold hover:bg-lime-400"
              >
                <Plus className="h-5 w-5 mr-2" />
                Générer un rapport
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* View Report Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="bg-surface border-[#1F3328] max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{selectedReport?.title}</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="mt-4">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#1F3328]">
                <span className="px-3 py-1 bg-lime-500/10 text-lime-500 text-sm">
                  {getReportLabel(selectedReport.report_type)}
                </span>
                <span className="text-sm text-[#8A9E91]">
                  {new Date(selectedReport.created_at).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
              </div>
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-[#8A9E91] leading-relaxed">
                  {selectedReport.content}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
