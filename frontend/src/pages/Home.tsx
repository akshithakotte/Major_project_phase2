import { Link } from "react-router-dom";
import { 
  Zap, 
  Shield, 
  Brain, 
  BarChart3, 
  ArrowRight,
  Cpu,
  Lock,
  LineChart
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Brain,
    title: "Hybrid AI Models",
    description: "Combines CNN and Random Forest for accurate theft detection"
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Instant analysis with detailed performance metrics"
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security for utility data protection"
  },
  {
    icon: LineChart,
    title: "High Accuracy",
    description: "Achieves 97%+ accuracy in detecting electricity theft"
  }
];

const steps = [
  {
    number: "01",
    title: "Upload Training Data",
    description: "Upload historical consumption data with labels"
  },
  {
    number: "02",
    title: "Train Models",
    description: "CNN and Random Forest models train automatically"
  },
  {
    number: "03",
    title: "Run Predictions",
    description: "Upload new data to detect potential theft cases"
  },
  {
    number: "04",
    title: "View Results",
    description: "Get detailed reports with metrics and visualizations"
  }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50" style={{ background: "var(--glass-bg)" }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text">Electricity Theft AI</h1>
                <p className="text-xs text-muted-foreground">Advanced Detection System</p>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/results" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Results
              </Link>
              <Link to="/proposed-system" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                System
              </Link>
              <Button asChild size="sm" className="ml-4">
                <Link to="/dashboard">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Detection</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Detect Electricity Theft with{" "}
            <span className="gradient-text">Machine Learning</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Advanced hybrid CNN-Random Forest system for identifying abnormal consumption patterns 
            and preventing energy theft in utility networks.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg" className="px-8">
              <Link to="/dashboard">
                Launch Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/proposed-system">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16 border-t border-border">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solution for electricity theft detection
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="glass-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-16 border-t border-border">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple four-step process for theft detection
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="glass-card rounded-xl p-6">
                <span className="text-4xl font-bold text-primary/20">{step.number}</span>
                <h3 className="font-semibold mt-4 mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-border" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16 border-t border-border">
        <div className="glass-card rounded-2xl p-12 text-center">
          <Lock className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Grid?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Start using our AI-powered system to detect electricity theft and protect your utility network.
          </p>
          <Button asChild size="lg">
            <Link to="/dashboard">
              Access Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>Electricity Theft Detection System - Powered by CNN & Random Forest</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
