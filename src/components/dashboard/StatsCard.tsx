import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  className?: string;
  icon?: ReactNode;
}

export function StatsCard({ title, value, change, className, icon }: StatsCardProps) {
  return (
    <Card className={cn("p-4 sm:p-6", className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
        {icon}
      </div>
      <div className="mt-2">
        <h3 className="text-xl sm:text-2xl font-semibold">{value}</h3>
        {change && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {change}
          </p>
        )}
      </div>
    </Card>
  );
}