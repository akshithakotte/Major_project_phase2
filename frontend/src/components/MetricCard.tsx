import { useCounterAnimation } from "@/hooks/useCounterAnimation";

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  variant?: "blue" | "green" | "warning";
  animate?: boolean;
  numericValue?: number;
}

const MetricCard = ({ label, value, subtitle, variant = "blue", animate = false, numericValue }: MetricCardProps) => {
  const colorMap = {
    blue: "text-primary glow-text-blue",
    green: "text-accent glow-text-green",
    warning: "text-warning",
  };

  const borderMap = {
    blue: "border-primary/20 hover:border-primary/40",
    green: "border-accent/20 hover:border-accent/40",
    warning: "border-warning/20 hover:border-warning/40",
  };

  // Extract numeric value for animation if not provided
  const extractNumber = (val: string): number => {
    const match = val.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const targetValue = numericValue !== undefined ? numericValue : extractNumber(value);
  const { count, ref } = useCounterAnimation(animate ? targetValue : 0, 1500, animate);

  // Format the animated value
  const formatValue = (val: number): string => {
    if (value.includes('%')) return `${val.toFixed(2)}%`;
    if (value.includes('.')) return val.toFixed(2);
    return val.toString();
  };

  const displayValue = animate ? formatValue(count) : value;

  return (
    <div ref={ref} className={`glass-card rounded-xl p-5 border ${borderMap[variant]} transition-all duration-300 hover:scale-105`}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-bold font-mono ${colorMap[variant]} animate-count`}>{displayValue}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
};

export default MetricCard;
