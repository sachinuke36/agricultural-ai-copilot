interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: "green" | "yellow" | "red" | "blue";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colors = {
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  blue: "bg-blue-500"
};

const sizes = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3"
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  color = "green",
  size = "md",
  className = ""
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
          {label && <span>{label}</span>}
          {showValue && <span>{percentage.toFixed(1)}%</span>}
        </div>
      )}
      <div className={`w-full bg-zinc-200 dark:bg-zinc-700 rounded-full ${sizes[size]}`}>
        <div
          className={`${sizes[size]} rounded-full transition-all duration-300 ${colors[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
