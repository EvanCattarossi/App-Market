import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  Zap,
  TrendingUp,
  Target,
  Brain,
  BarChart3,
  Shield,
  ArrowRight,
  Check
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const features = [
  {
    icon: Brain,
    title: "Analyse IA Avancée",
    description: "GPT-5.2 analyse vos marchés et génère des insights stratégiques en temps réel."
  },
  {
    icon: Target,
    title: "Détection d'Opportunités",
    description: "Identifiez les meilleures opportunités de croissance avant vos concurrents."
  },
  {
    icon: BarChart3,
    title: "Rapports Automatisés",
    description: "Générez des rapports professionnels en un clic pour vos investisseurs."
  },
  {
    icon: Shield,
    title: "Analyse des Risques",
    description: "Évaluez les risques potentiels et prenez des décisions éclairées."
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "0€",
    period: "/mois",
    description: "Pour découvrir MarketPulse",
    features: [
      "3 analyses par mois",
      "Rapports basiques",
      "Support email"
    ],
    cta: "Commencer Gratuitement",
    popular: false
  },
  {
    name: "Pro",
    price: "49€",
    period: "/mois",
    description: "Pour les entrepreneurs ambitieux",
    features: [
      "Analyses illimitées",
      "Rapports IA avancés",
      "Alertes opportunités",
      "Support prioritaire",
      "Export PDF"
    ],
    cta: "Essai Gratuit 14 jours",
    popular: true
  },
  {
    name: "Enterprise",
    price: "199€",
    period: "/mois",
    description: "Pour les équipes et agences",
    features: [
      "Tout Pro +",
      "Multi-utilisateurs",
      "API Access",
      "Intégrations custom",
      "Account Manager dédié"
    ],
    cta: "Nous Contacter",
    popular: false
  }
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1F3328] bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" data-testid="logo">
            <Zap className="h-7 w-7 text-lime-500" />
            <span className="font-display font-bold text-xl">MarketPulse</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-[#8A9E91] hover:text-foreground" data-testid="login-nav-btn">
                Connexion
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-lime-500 text-black font-bold hover:bg-lime-400" data-testid="register-nav-btn">
                Commencer
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lime-500/10 rounded-full blur-3xl" />
        </div>
        
        <motion.div
          className="relative max-w-4xl mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-lime-500/10 border border-lime-500/20 text-lime-500 text-sm font-mono">
              <TrendingUp className="h-4 w-4" />
              Propulsé par GPT-5.2
            </span>
          </motion.div>
          
          <motion.h1
            variants={fadeInUp}
            className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6"
          >
            Trouvez les{" "}
            <span className="text-lime-500 glow-text">Opportunités</span>
            <br />
            Qui Génèrent des Revenus
          </motion.h1>
          
          <motion.p
            variants={fadeInUp}
            className="text-lg text-[#8A9E91] max-w-2xl mx-auto mb-10"
          >
            L'IA qui analyse vos marchés, détecte les opportunités cachées et génère des rapports stratégiques pour maximiser vos revenus.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-lime-500 text-black font-bold text-lg px-8 hover:bg-lime-400 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
                data-testid="hero-cta-btn"
              >
                Analyser Mon Marché
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-[#1F3328] text-foreground hover:border-lime-500 hover:text-lime-500"
            >
              Voir la Démo
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 border-t border-[#1F3328]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Une Plateforme <span className="text-lime-500">Complète</span>
            </h2>
            <p className="text-[#8A9E91] max-w-xl mx-auto">
              Tous les outils dont vous avez besoin pour dominer votre marché
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 bg-surface border border-[#1F3328] hover:border-lime-500/50 transition-colors"
                data-testid={`feature-card-${index}`}
              >
                <div className="w-12 h-12 bg-lime-500/10 flex items-center justify-center mb-4 group-hover:bg-lime-500/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-lime-500" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-[#8A9E91] text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 border-t border-[#1F3328]" id="pricing">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Tarifs <span className="text-lime-500">Transparents</span>
            </h2>
            <p className="text-[#8A9E91] max-w-xl mx-auto">
              Choisissez le plan adapté à votre croissance
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-6 bg-surface border ${
                  plan.popular ? "border-lime-500" : "border-[#1F3328]"
                }`}
                data-testid={`pricing-card-${plan.name.toLowerCase()}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-lime-500 text-black text-xs font-bold uppercase tracking-wider">
                    Populaire
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="font-display font-bold text-xl mb-2">{plan.name}</h3>
                  <p className="text-[#8A9E91] text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-display font-black text-4xl">{plan.price}</span>
                    <span className="text-[#8A9E91]">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-lime-500 flex-shrink-0" />
                      <span className="text-[#8A9E91]">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-lime-500 text-black font-bold hover:bg-lime-400"
                        : "bg-transparent border border-[#1F3328] hover:border-lime-500 hover:text-lime-500"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-[#1F3328]">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            Prêt à <span className="text-lime-500">Dominer</span> Votre Marché ?
          </h2>
          <p className="text-[#8A9E91] mb-8">
            Rejoignez des milliers d'entrepreneurs qui utilisent MarketPulse pour croître plus vite.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              className="bg-lime-500 text-black font-bold text-lg px-8 hover:bg-lime-400 animate-pulse-glow"
              data-testid="cta-bottom-btn"
            >
              Commencer Maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#1F3328]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-lime-500" />
            <span className="font-display font-bold">MarketPulse</span>
          </div>
          <p className="text-[#8A9E91] text-sm">
            © 2024 MarketPulse AI. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
