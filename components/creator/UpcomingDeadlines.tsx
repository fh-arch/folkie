import { Clock, Upload, Video, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Deadline {
  id: string;
  title: string;
  brand: string;
  type: "submission" | "publish";
  daysLeft: number;
}

const DEADLINES: Deadline[] = [
  { id: "1", title: "İçerik teslimi", brand: "Lokal Coffee", type: "submission", daysLeft: 1 },
  { id: "2", title: "Yayına alınacak", brand: "Mavi Jeans", type: "publish", daysLeft: 3 },
  { id: "3", title: "Revizyon teslimi", brand: "Nivea TR", type: "submission", daysLeft: 5 },
];

export function UpcomingDeadlines() {
  return (
    <section className="card-folkie p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-body font-semibold">Yaklaşan Teslimler</h3>
        <button className="text-caption text-primary hover:underline">
          Tümü
        </button>
      </div>

      <ul className="mt-4 space-y-3">
        {DEADLINES.map((d) => {
          const Icon = d.type === "submission" ? Upload : Video;
          const urgent = d.daysLeft <= 1;
          return (
            <li
              key={d.id}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3",
                urgent ? "border-destructive/30 bg-destructive/5" : "border-border",
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  urgent ? "bg-destructive/15 text-destructive" : "bg-primary-light text-primary",
                )}
              >
                {urgent ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-small font-medium">{d.title}</div>
                <div className="truncate text-caption text-muted-foreground">
                  {d.brand}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={cn(
                    "flex items-center gap-1 text-caption font-semibold",
                    urgent ? "text-destructive" : "text-foreground",
                  )}
                >
                  <Clock className="h-3 w-3" />
                  {d.daysLeft}g
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
