import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "blue" | "green" | "warning";
}

const GlassCard = ({ children, className = "", glowColor }: GlassCardProps) => {
  const glowStyles = glowColor === "green"
    ? "hover:shadow-[var(--glow-green)]"
    : glowColor === "warning"
    ? "hover:shadow-[0_0_20px_hsl(38_92%_55%/0.3)]"
    : "";

  return (
    <div className={`glass-card rounded-xl p-6 ${glowStyles} ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
