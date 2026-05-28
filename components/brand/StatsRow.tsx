import {
  Users,
  TrendingUp,
  Target,
  Heart,
  Handshake,
  ArrowUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: string;
  delta: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconFg: string;
}

const STATS: Stat[] = [
  {
    label: "Total Creators",
    value: "12.4K",
    delta: "18.2%",
    icon: Users,
    iconBg: "bg-primary-light",
    iconFg: "text-primary",
  },
  {
    label: "Active Campaigns",
    value: "24",
    delta: "12.5%",
    icon: TrendingUp,
    iconBg: "bg-primary-light",
    iconFg: "text-primary",
  },
  {
    label: "Total Reach",
    value: "2.4M",
    delta: "24.6%",
    icon: Target,
    iconBg: "bg-warning/15",
    iconFg: "text-warning",
  },
  {
    label: "Engagement Rate",
    value: "6.78%",
    delta: "15.3%",
    icon: Heart,
    iconBg: "bg-accent/20",
    iconFg: "text-foreground",
  },
  {
    label: "Collaborations",
    value: "320",
    delta: "11.7%",
    icon: Handshake,
    iconBg: "bg-primary-light",
    iconFg: "text-primary",
  },
];

export function BrandStatsRow() {
  return (
    <section className="card-folkie grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5">
      {STATS.map((stat) => (
        <StatTile key={stat.label} stat={stat} />
      ))}
    </section>
  );
}

function StatTile({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          stat.iconBg,
        )}
      >
        <Icon className={cn("h-5 w-5", stat.iconFg)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="truncate text-caption text-muted-foreground">
          {stat.label}
        </div>
        <div className="text-h3 leading-tight">{stat.value}</div>
        <div className="flex items-center gap-1 text-caption text-success">
          <ArrowUp className="h-3 w-3" />
          {stat.delta}
        </div>
      </div>
    </div>
  );
}
