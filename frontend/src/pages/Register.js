import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Zap, ArrowLeft, Loader2 } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    company_name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { full_name, company_name, email, password } = formData;
    
    if (!full_name || !company_name || !email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    setLoading(true);
    try {
      await register(formData);
      toast.success("Compte créé avec succès !");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface border-r border-[#1F3328] flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2">
          <Zap className="h-8 w-8 text-lime-500" />
          <span className="font-display font-bold text-2xl">MarketPulse</span>
        </Link>
        
        <div>
          <h1 className="font-display font-black text-4xl mb-4">
            Commencez <span className="text-lime-500">Gratuitement</span>
          </h1>
          <p className="text-[#8A9E91] text-lg">
            Créez votre compte et découvrez les opportunités cachées de votre marché en quelques minutes.
          </p>
        </div>
        
        <p className="text-[#4A5E51] text-sm">
          © 2024 MarketPulse AI
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#8A9E91] hover:text-foreground mb-8 lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
          
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Zap className="h-7 w-7 text-lime-500" />
            <span className="font-display font-bold text-xl">MarketPulse</span>
          </div>

          <h2 className="font-display font-bold text-2xl mb-2">Créer un compte</h2>
          <p className="text-[#8A9E91] mb-8">
            Déjà inscrit ?{" "}
            <Link to="/login" className="text-lime-500 hover:underline">
              Se connecter
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nom complet</Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="Jean Dupont"
                value={formData.full_name}
                onChange={handleChange}
                className="bg-surface border-[#1F3328] focus:border-lime-500"
                data-testid="fullname-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Nom de l'entreprise</Label>
              <Input
                id="company_name"
                name="company_name"
                placeholder="Ma Startup SAS"
                value={formData.company_name}
                onChange={handleChange}
                className="bg-surface border-[#1F3328] focus:border-lime-500"
                data-testid="company-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="vous@entreprise.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-surface border-[#1F3328] focus:border-lime-500"
                data-testid="email-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="bg-surface border-[#1F3328] focus:border-lime-500"
                data-testid="password-input"
              />
              <p className="text-xs text-[#4A5E51]">Minimum 6 caractères</p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-lime-500 text-black font-bold hover:bg-lime-400"
              data-testid="register-submit-btn"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Créer Mon Compte"
              )}
            </Button>
          </form>

          <p className="text-xs text-[#4A5E51] text-center mt-6">
            En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
