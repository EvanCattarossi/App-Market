import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  LineChart,
  Lightbulb,
  FileText,
  LogOut,
  Menu,
  X,
  Zap
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/analyses", label: "Analyses", icon: LineChart },
  { path: "/opportunities", label: "Opportunités", icon: Lightbulb },
  { path: "/reports", label: "Rapports", icon: FileText },
];

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-surface border-b border-[#1F3328] flex items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-lime-500" />
          <span className="font-display font-bold text-lg">MarketPulse</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          data-testid="mobile-menu-toggle"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-[#1F3328] transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center gap-2 px-6 border-b border-[#1F3328]">
            <Zap className="h-6 w-6 text-lime-500" />
            <span className="font-display font-bold text-xl">MarketPulse</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  data-testid={`nav-${item.path.slice(1)}`}
                  className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-lime-500 text-black font-semibold"
                      : "text-[#8A9E91] hover:text-foreground hover:bg-[#111F18]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-[#1F3328]">
            <div className="mb-3 px-2">
              <p className="text-sm font-medium truncate">{user?.full_name}</p>
              <p className="text-xs text-[#8A9E91] truncate">{user?.company_name}</p>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-[#8A9E91] hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
              data-testid="logout-btn"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
