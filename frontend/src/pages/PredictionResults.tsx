import AppHeader from "@/components/AppHeader";
import { Link } from "react-router-dom";
import { ArrowLeft, FileSearch, AlertTriangle, CheckCircle, Database } from "lucide-react";
import { useEffect, useState } from "react";
import type { PredictionResult } from "@/lib/api";

const PredictionResults = () => {
  const [result, setResult] = useState<PredictionResult>({ total: 0, theft: 0, normal: 0 });

  useEffect(() => {
    const stored = sessionStorage.getItem("predictionResult");
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background grid-bg">
      <AppHeader />

      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <FileSearch className="w-6 h-6 text-primary" />
              Prediction Results
            </h2>
            <p className="text-sm text-muted-foreground">Electricity theft detection analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="glass-card rounded-xl p-8 text-center border border-primary/20 hover:border-primary/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Database className="w-7 h-7 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Total Records</p>
            <p className="text-4xl font-bold font-mono text-primary glow-text-blue">{result.total}</p>
          </div>

          <div className="glass-card rounded-xl p-8 text-center border border-warning/20 hover:border-warning/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-warning" />
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Theft Detected</p>
            <p className="text-4xl font-bold font-mono text-warning">{result.theft}</p>
            <p className="text-xs text-destructive mt-1">⚠ Requires Investigation</p>
          </div>

          <div className="glass-card rounded-xl p-8 text-center border border-accent/20 hover:border-accent/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Normal Records</p>
            <p className="text-4xl font-bold font-mono text-accent glow-text-green">{result.normal}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PredictionResults;
