import { ArrowUp, Wallet, TrendingUp } from "lucide-react";
import { formatTRY } from "@/lib/utils";

export function EarningsWidget() {
  return (
    <section className="card-navy">
      <div className="flex items-center justify-between text-caption text-navy-foreground/70">
        <span className="flex items-center gap-1.5">
          <Wallet className="h-3.5 w-3.5 text-accent" />
          Bu Ay Kazancım
        </span>
        <button className="hover:text-navy-foreground">Detaylar</button>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-h2 font-bold text-navy-foreground">
          {formatTRY(12450)}
        </span>
        <span className="flex items-center text-caption text-accent">
          <ArrowUp className="h-3 w-3" />
          32%
        </span>
      </div>

      <p className="mt-1 text-caption text-navy-foreground/60">
        Geçen aydan {formatTRY(3000)} fazla
      </p>

      {/* Mini bar chart — son 6 ay */}
      <div className="mt-4 flex items-end gap-1.5 h-20">
        {[40, 55, 35, 70, 60, 90].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-md bg-gradient-to-t from-primary to-accent"
              style={{ height: `${h}%` }}
            />
            <span className="text-[10px] text-navy-foreground/50">
              {["Ara", "Oca", "Şub", "Mar", "Nis", "May"][i]}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-navy-foreground/10 pt-3">
        <div>
          <div className="text-caption text-navy-foreground/60">Bekleyen</div>
          <div className="text-small font-semibold text-navy-foreground">
            {formatTRY(4800)}
          </div>
        </div>
        <div>
          <div className="text-caption text-navy-foreground/60">Toplam</div>
          <div className="text-small font-semibold text-navy-foreground">
            {formatTRY(87320)}
          </div>
        </div>
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-small font-semibold text-accent-foreground hover:bg-accent/90">
        <TrendingUp className="h-4 w-4" />
        Kazançlarımı Gör
      </button>
    </section>
  );
}
