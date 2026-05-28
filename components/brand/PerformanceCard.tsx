import { ArrowUp, ChevronDown } from "lucide-react";

export function PerformanceCard() {
  return (
    <section className="card-folkie p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-body font-semibold">Performans Özeti</h3>
        <button className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-caption text-muted-foreground hover:border-primary">
          Son 30 Gün
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* Sparkline (basit SVG) */}
      <svg viewBox="0 0 300 100" className="mt-4 h-24 w-full">
        <polyline
          fill="none"
          stroke="#6B3DFF"
          strokeWidth="2.5"
          points="0,80 30,70 60,50 90,55 120,40 150,45 180,30 210,35 240,20 270,25 300,15"
        />
        <polyline
          fill="none"
          stroke="#C6FF00"
          strokeWidth="2.5"
          points="0,90 30,85 60,75 90,80 120,65 150,70 180,55 210,60 240,45 270,50 300,40"
        />
      </svg>

      <div className="mt-3 grid grid-cols-2 gap-4 border-t border-border pt-3">
        <div>
          <div className="flex items-center gap-1.5 text-caption text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Erişim
          </div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="text-body font-semibold">2.4M</span>
            <span className="flex items-center text-caption text-success">
              <ArrowUp className="h-3 w-3" />
              24.6%
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-caption text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Etkileşim
          </div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="text-body font-semibold">163K</span>
            <span className="flex items-center text-caption text-success">
              <ArrowUp className="h-3 w-3" />
              18.7%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
