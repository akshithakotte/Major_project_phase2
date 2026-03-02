import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import UploadPanel from "@/components/UploadPanel";
import MetricCard from "@/components/MetricCard";
import { Brain, Search, Zap, Shield, Target, BarChart3, Info } from "lucide-react";
import { trainModel, runPrediction, isDemoMode } from "@/lib/api";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const navigate = useNavigate();
  const [trainingLoading, setTrainingLoading] = useState(false);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [metrics, setMetrics] = useState<{
    cnn_acc: string; rf_acc: string; precision: string; recall: string; f1: string;
  } | null>(null);

  const handleTrain = async (file: File) => {
    setTrainingLoading(true);
    try {
      const result = await trainModel(file);
      const m = result.metrics;
      setMetrics({
        cnn_acc: m.CNN.accuracy.toFixed(2),
        rf_acc: m.RandomForest.accuracy.toFixed(2),
        precision: m.CNN.precision.toFixed(2),
        recall: m.CNN.recall.toFixed(2),
        f1: m.CNN.f1_score.toFixed(2),
      });
      toast.success(result.message || "Training completed successfully!");
      sessionStorage.setItem("trainingMetrics", JSON.stringify(m));
      setTimeout(() => navigate("/results"), 1500);
    } catch (err) {
      toast.error("Training failed. Make sure your Flask server is running.");
    } finally {
      setTrainingLoading(false);
    }
  };

  const handlePredict = async (file: File) => {
    setPredictionLoading(true);
    try {
      const result = await runPrediction(file);
      toast.success(`Prediction complete! ${result.theft} theft cases detected out of ${result.total}.`);
      sessionStorage.setItem("predictionResult", JSON.stringify(result));
      setTimeout(() => navigate("/predictions"), 1500);
    } catch (err) {
      toast.error("Prediction failed. Make sure your Flask server is running.");
    } finally {
      setPredictionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      <AppHeader />

      <main className="container mx-auto px-6 py-8">
        {/* Back to Home */}
        <div className="mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Demo Mode Banner */}
        {isDemoMode() && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-lg border border-warning/30 bg-warning/5 text-warning text-sm">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              <strong>Demo Mode:</strong> Using simulated data. Set <code className="bg-warning/10 px-1 rounded">VITE_DEMO_MODE=false</code> to connect to your Flask server.
            </span>
          </div>
        )}

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Train hybrid CNN–Random Forest models and detect electricity theft from consumption data.
          </p>
        </div>

        {/* Upload Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <UploadPanel
            title="Train Models"
            description="Upload historical consumption data (ElectricityTheft.csv) to train the CNN and Random Forest classifiers."
            buttonLabel="Start Training"
            icon={<Brain className="w-7 h-7" />}
            accentColor="blue"
            onFileSubmit={handleTrain}
            isLoading={trainingLoading}
          />
          <UploadPanel
            title="Run Prediction"
            description="Upload new consumption records (test.csv) to detect potential electricity theft cases."
            buttonLabel="Run Detection"
            icon={<Search className="w-7 h-7" />}
            accentColor="green"
            onFileSubmit={handlePredict}
            isLoading={predictionLoading}
          />
        </div>

        {/* Metrics Preview */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Performance Metrics</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 ml-2">
              {metrics ? "Latest Run" : "No Data Yet"}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <MetricCard label="CNN Accuracy" value={metrics ? `${metrics.cnn_acc}%` : "—"} subtitle="Deep learning model" variant="blue" />
            <MetricCard label="RF Accuracy" value={metrics ? `${metrics.rf_acc}%` : "—"} subtitle="Random Forest" variant="green" />
            <MetricCard label="Precision" value={metrics ? `${metrics.precision}%` : "—"} variant="blue" />
            <MetricCard label="Recall" value={metrics ? `${metrics.recall}%` : "—"} variant="green" />
            <MetricCard label="F1 Score" value={metrics ? `${metrics.f1}%` : "—"} variant="blue" />
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Hybrid CNN–RF Architecture</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5" />
            <span>Real-time Theft Detection</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
