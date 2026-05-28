import { ArrowUp, Users, Heart, Eye } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

interface Metric {
  label: string;
  value: string;
  delta: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

const METRICS: Metric[] = [
  {
    label: "Followers",
    value: formatNumber(8420),
    delta: "+312",
    icon: Users,
    iconColor: "text-primary",
  },
  {
    label: "Reach",
    value: formatNumber(124000),
    delta: "+24%",
    icon: Eye,
    iconColor: "text-accent-foreground",
  },
  {
    label: "Engagement",
    value: formatNumber(8900),
    delta: "+18%",
    icon: Heart,
    iconColor: "text-destructive",
  },
];

export function GrowthSnapshot() {
  return (
    <section className="card-folkie p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-body font-semibold">Growth Summary</h3>
        <span className="text-caption text-muted-foreground">Last 30 Days</span>
      </div>

      <ul className="mt-4 space-y-3">
        {METRICS.map((m) => {
          const Icon = m.icon;
          return (
            <li key={m.label} className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full bg-muted",
                  m.iconColor,
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-caption text-muted-foreground">{m.label}</div>
                <div className="text-body font-semibold">{m.value}</div>
              </div>
              <div className="flex items-center gap-1 text-caption text-success">
                <ArrowUp className="h-3 w-3" />
                {m.delta}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 rounded-xl bg-primary-light p-3 text-caption text-foreground">
        🌱 <span className="font-semibold text-primary">312 new followers</span>{" "}
        this month. You&apos;re 78% of the way to your goal.
      </div>
    </section>
  );
}
