import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface RiskBadgeProps {
  level: "SAFE" | "MODERATE" | "HIGH" | "CRITICAL";
  className?: string;
}

export default function RiskBadge({ level, className }: RiskBadgeProps) {
  const config = {
    SAFE: {
      color: "bg-safe/10 text-safe border-safe/20",
      icon: CheckCircle,
      label: "Safe",
    },
    MODERATE: {
      color: "bg-moderate/10 text-moderate border-moderate/20",
      icon: AlertCircle,
      label: "Moderate Risk",
    },
    HIGH: {
      color: "bg-high/10 text-high border-high/20",
      icon: AlertTriangle,
      label: "High Risk",
    },
    CRITICAL: {
      color: "bg-critical/10 text-critical border-critical/20",
      icon: XCircle,
      label: "Critical Risk",
    },
  };

  const { color, icon: Icon, label } = config[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium",
        color,
        className
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </span>
  );
}
