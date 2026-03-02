import { Link, useLocation } from "react-router-dom";
import { Activity, BarChart3, Cpu, FileText } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { to: "/", label: "Home", icon: Activity },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/results", label: "Results", icon: BarChart3 },
  { to: "/proposed-system", label: "System", icon: FileText },
];

const AppHeader = () => {
  const location = useLocation();

  return (
    <header className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50" style={{ background: "var(--glass-bg)" }}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">Electricity Theft AI</h1>
              <p className="text-xs text-muted-foreground">Model Training & Detection Dashboard</p>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
            <span className="text-xs font-medium text-accent hidden sm:inline">System Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
