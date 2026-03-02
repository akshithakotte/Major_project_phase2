import { useEffect, useState, useCallback } from "react";
import AppHeader from "@/components/AppHeader";
import MetricCard from "@/components/MetricCard";
import ConfusionMatrix from "@/components/ConfusionMatrix";
import { Link } from "react-router-dom";
import { ArrowLeft, BarChart3, TrendingUp, Loader2, Award, Target, Zap, Brain } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Cell } from "recharts";
import { fetchResults, type TrainingMetrics } from "@/lib/api";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const FadeInSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Chart wrapper that only renders chart when in view to trigger animation
const ChartFadeIn = ({ 
  children, 
  delay = 0,
  onVisible 
}: { 
  children: (isVisible: boolean) => React.ReactNode; 
  delay?: number;
  onVisible?: () => void;
}) => {
  const { ref, isVisible } = useScrollAnimation();
  
  useEffect(() => {
    if (isVisible && onVisible) {
      onVisible();
    }
  }, [isVisible, onVisible]);
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children(isVisible)}
    </div>
  );
};

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
          <FadeInSection>
            <div className="glass-card rounded-xl p-6 mb-8 border-2 border-primary/30 bg-primary/5">
              <div className="flex items-center justify-center gap-4">
                <Award className="w-8 h-8 text-primary animate-pulse" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Best Performing Model</p>
                  <p className="text-2xl font-bold gradient-heading">
                    {bestModel.name} ({bestModel.accuracy.toFixed(2)}% Accuracy)
                  </p>
                </div>
                <bestModel.icon className={`w-8 h-8 ${bestModel.color}`} />
              </div>
            </div>
          </FadeInSection>
        )}

        {/* KPI Cards with Counter Animation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <FadeInSection delay={100}>
            <MetricCard label="CNN Accuracy" value={`${data.CNN.accuracy.toFixed(2)}%`} variant="blue" animate={true} numericValue={data.CNN.accuracy} />
          </FadeInSection>
          <FadeInSection delay={200}>
            <MetricCard label="RF Accuracy" value={`${data.RandomForest.accuracy.toFixed(2)}%`} variant="green" animate={true} numericValue={data.RandomForest.accuracy} />
          </FadeInSection>
          <FadeInSection delay={300}>
            <MetricCard label="CNN F1 Score" value={`${data.CNN.f1_score.toFixed(2)}%`} variant="blue" animate={true} numericValue={data.CNN.f1_score} />
          </FadeInSection>
          <FadeInSection delay={400}>
            <MetricCard label="RF F1 Score" value={`${data.RandomForest.f1_score.toFixed(2)}%`} variant="green" animate={true} numericValue={data.RandomForest.f1_score} />
          </FadeInSection>
        </div>

        {/* Comparison Table */}
        <FadeInSection>
          <div className="glass-card rounded-xl p-6 mb-8 hover:shadow-lg transition-shadow duration-500">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary animate-pulse" />
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
        </FadeInSection>

        {/* Confusion Matrices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <FadeInSection delay={100}>
            <ConfusionMatrix title="CNN Confusion Matrix" matrix={data.CNN.confusion_matrix} />
          </FadeInSection>
          <FadeInSection delay={200}>
            <ConfusionMatrix title="Random Forest Confusion Matrix" matrix={data.RandomForest.confusion_matrix} />
          </FadeInSection>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Animated Bar Chart - only animates when scrolled into view */}
          <ChartFadeIn delay={100}>
            {(isVisible) => (
              <div className="glass-card rounded-xl p-6 relative overflow-hidden group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-sm font-semibold text-foreground mb-6 flex items-center gap-2 relative z-10">
                  <BarChart3 className="w-4 h-4 text-primary animate-pulse" />
                  Performance Comparison
                </h3>
                <div className="h-72 relative z-10">
                  {isVisible ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData} barGap={8}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} />
                        <YAxis domain={[85, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} />
                        <Tooltip
                          cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--foreground))",
                            fontSize: 12,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="CNN" name="CNN" radius={[6, 6, 0, 0]} fill="url(#cnnGradient)" animationDuration={1500} animationBegin={0}>
                          {comparisonData.map((entry, index) => (
                            <Cell key={`cell-cnn-${index}`} fill="url(#cnnGradient)" className="hover:opacity-80 transition-opacity" />
                          ))}
                        </Bar>
                        <Bar dataKey="RF" name="Random Forest" radius={[6, 6, 0, 0]} fill="url(#rfGradient)" animationDuration={1500} animationBegin={300}>
                          {comparisonData.map((entry, index) => (
                            <Cell key={`cell-rf-${index}`} fill="url(#rfGradient)" className="hover:opacity-80 transition-opacity" />
                          ))}
                        </Bar>
                        <defs>
                          <linearGradient id="cnnGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(217 91% 70%)" />
                            <stop offset="100%" stopColor="hsl(217 91% 50%)" />
                          </linearGradient>
                          <linearGradient id="rfGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(142 71% 55%)" />
                            <stop offset="100%" stopColor="hsl(142 71% 35%)" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">Scroll to view chart</div>}
                </div>
              </div>
            )}
          </ChartFadeIn>

          {/* Animated Radar Chart - only animates when scrolled into view */}
          <ChartFadeIn delay={200}>
            {(isVisible) => (
              <div className="glass-card rounded-xl p-6 relative overflow-hidden group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-sm font-semibold text-foreground mb-6 flex items-center gap-2 relative z-10">
                  <Zap className="w-4 h-4 text-primary animate-pulse" />
                  Model Capability Radar
                </h3>
                <div className="h-72 relative z-10">
                  {isVisible ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" opacity={0.5} />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[80, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                        <Radar
                          name="CNN"
                          dataKey="CNN"
                          stroke="hsl(217 91% 60%)"
                          strokeWidth={2}
                          fill="url(#cnnRadarGradient)"
                          fillOpacity={0.4}
                          animationDuration={2000}
                          animationBegin={0}
                        />
                        <Radar
                          name="Random Forest"
                          dataKey="RF"
                          stroke="hsl(142 71% 45%)"
                          strokeWidth={2}
                          fill="url(#rfRadarGradient)"
                          fillOpacity={0.4}
                          animationDuration={2000}
                          animationBegin={500}
                        />
                        <Legend />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--foreground))",
                            fontSize: 12,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                          }}
                        />
                        <defs>
                          <radialGradient id="cnnRadarGradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity={0.1} />
                          </radialGradient>
                          <radialGradient id="rfRadarGradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="hsl(142 71% 45%)" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="hsl(142 71% 45%)" stopOpacity={0.1} />
                          </radialGradient>
                        </defs>
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">Scroll to view chart</div>}
                </div>
              </div>
            )}
          </ChartFadeIn>
        </div>
      </main>
    </div>
  );
};

export default TrainingResults;
