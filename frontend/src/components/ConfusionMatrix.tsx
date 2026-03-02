interface ConfusionMatrixProps {
  title: string;
  matrix: number[][];
  labels?: string[];
}

const ConfusionMatrix = ({ title, matrix, labels = ["Normal", "Theft"] }: ConfusionMatrixProps) => {
  const getColor = (row: number, col: number) => {
    if (row === col) return "bg-accent/20 text-accent border-accent/30";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      <div className="flex flex-col items-center">
        <div className="text-xs text-muted-foreground mb-2 font-medium">Predicted</div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center mr-2">
            <span className="text-xs text-muted-foreground font-medium transform -rotate-90 origin-center whitespace-nowrap">Actual</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {/* Header row */}
            <div />
            <div />
            {labels.map((label, i) => (
              <div key={`h-${i}`} className="text-xs text-center text-muted-foreground font-medium py-1">{label}</div>
            ))}
            {/* Swap: label cols above didn't work, let me redo */}
          </div>
        </div>
        {/* Simpler layout */}
        <div className="mt-2">
          <div className="grid grid-cols-3 gap-2 items-center">
            <div />
            {labels.map((l, i) => (
              <div key={`ph-${i}`} className="text-xs text-center text-muted-foreground">{l}</div>
            ))}
            {matrix.map((row, ri) => (
              <>
                <div key={`rl-${ri}`} className="text-xs text-right text-muted-foreground pr-2">{labels[ri]}</div>
                {row.map((val, ci) => (
                  <div
                    key={`${ri}-${ci}`}
                    className={`w-16 h-16 flex items-center justify-center rounded-lg border font-mono text-lg font-bold ${getColor(ri, ci)}`}
                  >
                    {val}
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfusionMatrix;
