interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  variant?: "blue" | "green" | "warning";
}

const MetricCard = ({ label, value, subtitle, variant = "blue" }: MetricCardProps) => {
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

  return (
    <div className={`glass-card rounded-xl p-5 border ${borderMap[variant]} transition-all duration-300`}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-bold font-mono ${colorMap[variant]}`}>{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
};

export default MetricCard;
