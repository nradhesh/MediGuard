import { cn } from "@/lib/utils";

interface SeverityGaugeProps {
  score: number;
  className?: string;
}

export default function SeverityGauge({ score, className }: SeverityGaugeProps) {
  const getColor = () => {
    if (score < 25) return "bg-safe";
    if (score < 50) return "bg-moderate";
    if (score < 75) return "bg-high";
    return "bg-critical";
  };

  const getTextColor = () => {
    if (score < 25) return "text-safe";
    if (score < 50) return "text-moderate";
    if (score < 75) return "text-high";
    return "text-critical";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Severity Score</span>
        <span className={cn("text-2xl font-bold", getTextColor())}>{score}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full transition-all duration-500 rounded-full", getColor())}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>Safe</span>
        <span>Moderate</span>
        <span>High</span>
        <span>Critical</span>
        <span>100</span>
      </div>
    </div>
  );
}
