import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import MetricCard from "@/components/MetricCard";
import ConfusionMatrix from "@/components/ConfusionMatrix";
import { Link } from "react-router-dom";
import { ArrowLeft, BarChart3, TrendingUp, Loader2, Award, Target, Zap, Brain } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import { fetchResults, type TrainingMetrics } from "@/lib/api";

const TrainingResults = () => {
  const [data, setData] = useState<TrainingMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Try sessionStorage first (from train flow), then fetch from API
    const stored = sessionStorage.getItem("trainingMetrics");
    if (stored) {
      setData(JSON.parse(stored));
      setLoading(false);
      return;
    }

    fetchResults()
      .then(setData)
      .catch(() => setError("Could not load results. Make sure your Flask server is running."))
      .finally(() => setLoading(false));
  }, []);

  const comparisonData = data
    ? [
        { metric: "Accuracy", CNN: +data.CNN.accuracy.toFixed(2), RF: +data.RandomForest.accuracy.toFixed(2) },
        { metric: "Precision", CNN: +data.CNN.precision.toFixed(2), RF: +data.RandomForest.precision.toFixed(2) },
        { metric: "Recall", CNN: +data.CNN.recall.toFixed(2), RF: +data.RandomForest.recall.toFixed(2) },
        { metric: "F1 Score", CNN: +data.CNN.f1_score.toFixed(2), RF: +data.RandomForest.f1_score.toFixed(2) },
      ]
    : [];

  const radarData = data
    ? [
        { metric: "Accuracy", CNN: data.CNN.accuracy, RF: data.RandomForest.accuracy },
        { metric: "Precision", CNN: data.CNN.precision, RF: data.RandomForest.precision },
        { metric: "Recall", CNN: data.CNN.recall, RF: data.RandomForest.recall },
        { metric: "F1 Score", CNN: data.CNN.f1_score, RF: data.RandomForest.f1_score },
      ]
    : [];

  const bestModel = data
    ? data.CNN.accuracy > data.RandomForest.accuracy
      ? { name: "CNN", accuracy: data.CNN.accuracy, icon: Brain, color: "text-primary" }
      : { name: "Random Forest", accuracy: data.RandomForest.accuracy, icon: Target, color: "text-accent" }
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background grid-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background grid-bg">
        <AppHeader />
        <main className="container mx-auto px-6 py-20 text-center">
          <p className="text-destructive text-lg mb-4">{error || "No results available"}</p>
          <Link to="/" className="text-primary hover:underline">← Back to Dashboard</Link>
        </main>
      </div>
    );
  }

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
              <BarChart3 className="w-6 h-6 text-primary" />
              Training Results
            </h2>
            <p className="text-sm text-muted-foreground">Model performance comparison and evaluation metrics</p>
          </div>
        </div>

        {/* Winner Announcement */}
        {bestModel && (
          <div className="glass-card rounded-xl p-6 mb-8 border-2 border-primary/30 bg-primary/5">
            <div className="flex items-center justify-center gap-4">
              <Award className="w-8 h-8 text-primary" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Best Performing Model</p>
                <p className="text-2xl font-bold gradient-text">
                  {bestModel.name} ({bestModel.accuracy.toFixed(2)}% Accuracy)
                </p>
              </div>
              <bestModel.icon className={`w-8 h-8 ${bestModel.color}`} />
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard label="CNN Accuracy" value={`${data.CNN.accuracy.toFixed(2)}%`} variant="blue" />
          <MetricCard label="RF Accuracy" value={`${data.RandomForest.accuracy.toFixed(2)}%`} variant="green" />
          <MetricCard label="CNN F1 Score" value={`${data.CNN.f1_score.toFixed(2)}%`} variant="blue" />
          <MetricCard label="RF F1 Score" value={`${data.RandomForest.f1_score.toFixed(2)}%`} variant="green" />
        </div>

        {/* Comparison Table */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Performance Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Metric</th>
                  <th className="text-center py-3 px-4 text-primary font-medium">CNN</th>
                  <th className="text-center py-3 px-4 text-accent font-medium">Random Forest</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Difference</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row) => (
                  <tr key={row.metric} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{row.metric}</td>
                    <td className="py-3 px-4 text-center font-mono text-primary">{row.CNN}%</td>
                    <td className="py-3 px-4 text-center font-mono text-accent">{row.RF}%</td>
                    <td className="py-3 px-4 text-center font-mono text-warning">+{(row.CNN - row.RF).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Confusion Matrices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ConfusionMatrix title="CNN Confusion Matrix" matrix={data.CNN.confusion_matrix} />
          <ConfusionMatrix title="Random Forest Confusion Matrix" matrix={data.RandomForest.confusion_matrix} />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-6 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Performance Comparison
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} />
                  <YAxis domain={[85, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                      fontSize: 12,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="CNN" name="CNN" radius={[6, 6, 0, 0]} fill="hsl(217 91% 60%)" />
                  <Bar dataKey="RF" name="Random Forest" radius={[6, 6, 0, 0]} fill="hsl(142 71% 45%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Model Capability Radar
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[80, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                  <Radar
                    name="CNN"
                    dataKey="CNN"
                    stroke="hsl(217 91% 60%)"
                    fill="hsl(217 91% 60%)"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Random Forest"
                    dataKey="RF"
                    stroke="hsl(142 71% 45%)"
                    fill="hsl(142 71% 45%)"
                    fillOpacity={0.3}
                  />
                  <Legend />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                      fontSize: 12,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrainingResults;
