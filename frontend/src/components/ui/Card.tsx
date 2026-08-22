import { CardProps } from "@/types";

export function Card({ title, icon, iconBgColor = "bg-zinc-100 dark:bg-zinc-800", children, className = "", action }: CardProps) {
  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`p-2 rounded-lg ${iconBgColor}`}>
              {icon}
            </div>
          )}
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
        </div>
        {action}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

export function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`text-lg font-semibold text-zinc-900 dark:text-zinc-100 ${className}`}>
      {children}
    </h3>
  );
}
