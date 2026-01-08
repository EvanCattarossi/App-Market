import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Zap, ArrowLeft, Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Connexion réussie !");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur de connexion");
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
            Reprenez le <span className="text-lime-500">Contrôle</span>
          </h1>
          <p className="text-[#8A9E91] text-lg">
            Accédez à vos analyses de marché et découvrez de nouvelles opportunités de croissance.
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

          <h2 className="font-display font-bold text-2xl mb-2">Connexion</h2>
          <p className="text-[#8A9E91] mb-8">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-lime-500 hover:underline">
              Créer un compte
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@entreprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-surface border-[#1F3328] focus:border-lime-500"
                data-testid="email-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-surface border-[#1F3328] focus:border-lime-500"
                data-testid="password-input"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-lime-500 text-black font-bold hover:bg-lime-400"
              data-testid="login-submit-btn"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Se Connecter"
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
