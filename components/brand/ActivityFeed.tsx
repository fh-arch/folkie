import {
  UserPlus,
  FileText,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconFg: string;
  title: string;
  body: string;
  time: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    icon: UserPlus,
    iconBg: "bg-primary-light",
    iconFg: "text-primary",
    title: "Yeni creator başvurusu",
    body: "@elifduman iş birliği yapmak istiyor.",
    time: "2dk önce",
  },
  {
    id: "2",
    icon: FileText,
    iconBg: "bg-accent/20",
    iconFg: "text-foreground",
    title: "Kampanya raporu hazır",
    body: '"Yaz Koleksiyonu" kampanya raporu hazır.',
    time: "15dk önce",
  },
  {
    id: "3",
    icon: CheckCircle2,
    iconBg: "bg-primary-light",
    iconFg: "text-primary",
    title: "İş birliği onaylandı",
    body: "@mertoz ile iş birliği onaylandı.",
    time: "1 saat önce",
  },
  {
    id: "4",
    icon: CreditCard,
    iconBg: "bg-success/15",
    iconFg: "text-success",
    title: "Ödeme tamamlandı",
    body: "Nisan ayı ödemesi başarıyla tamamlandı.",
    time: "3 saat önce",
  },
];

export function ActivityFeed() {
  return (
    <section className="card-folkie p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-body font-semibold">Aktivite Akışı</h3>
        <button className="text-caption text-primary hover:underline">
          Tümünü Gör
        </button>
      </div>

      <ul className="mt-4 space-y-3">
        {ACTIVITIES.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id} className="flex gap-3">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  item.iconBg,
                )}
              >
                <Icon className={cn("h-4 w-4", item.iconFg)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-small font-medium">
                    {item.title}
                  </p>
                  <span className="shrink-0 text-caption text-muted-foreground">
                    {item.time}
                  </span>
                </div>
                <p className="truncate text-caption text-muted-foreground">
                  {item.body}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
