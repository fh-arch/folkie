import { Wallet, Handshake, CheckCircle2, Heart, Star, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: string;
  delta?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconFg: string;
}

const STATS: Stat[] = [
  {
    label: "This Month's Earnings",
    value: "₺12.450",
    delta: "32%",
    icon: Wallet,
    iconBg: "bg-accent/25",
    iconFg: "text-accent-foreground",
  },
  {
    label: "Active Collaborations",
    value: "3",
    icon: Handshake,
    iconBg: "bg-primary-light",
    iconFg: "text-primary",
  },
  {
    label: "Completed",
    value: "27",
    delta: "5",
    icon: CheckCircle2,
    iconBg: "bg-success/15",
    iconFg: "text-success",
  },
  {
    label: "Engagement Rate",
    value: "7.4%",
    delta: "0.8",
    icon: Heart,
    iconBg: "bg-accent/25",
    iconFg: "text-accent-foreground",
  },
  {
    label: "Brand Score",
    value: "4.9 / 5",
    icon: Star,
    iconBg: "bg-warning/15",
    iconFg: "text-warning",
  },
];

export function CreatorStatsRow() {
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
        {stat.delta && (
          <div className="flex items-center gap-1 text-caption text-success">
            <ArrowUp className="h-3 w-3" />
            {stat.delta}
          </div>
        )}
      </div>
    </div>
  );
}
