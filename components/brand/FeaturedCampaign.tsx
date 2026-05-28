import { ArrowRight, Star } from "lucide-react";

export function FeaturedCampaign() {
  return (
    <section className="card-navy relative overflow-hidden">
      <div className="flex items-center justify-between text-caption text-navy-foreground/70">
        <span className="flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 text-accent" fill="#C6FF00" />
          Öne Çıkan Kampanya
        </span>
        <button className="hover:text-navy-foreground">Tümünü Gör</button>
      </div>

      <h3 className="mt-3 text-h3 leading-tight text-navy-foreground">
        Yaz Koleksiyonu
        <br />
        Lansmanı
      </h3>

      <span className="mt-3 inline-block rounded-full bg-accent/20 px-3 py-0.5 text-caption font-medium text-accent">
        Aktif
      </span>

      <div className="mt-3 text-small text-navy-foreground/70">
        Moda &amp; Lifestyle
      </div>
      <div className="text-caption text-navy-foreground/60">
        15 Creator • 2.1M Erişim
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-caption text-navy-foreground/70">
          <span>İlerleme</span>
          <span className="font-semibold text-navy-foreground">%68</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-navy-foreground/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            style={{ width: "68%" }}
          />
        </div>
      </div>

      {/* Foto kolajı (placeholder) */}
      <div className="mt-4 flex -space-x-4">
        <div className="h-16 w-16 rounded-2xl border-2 border-navy bg-gradient-to-br from-amber-200 to-amber-400" />
        <div className="h-16 w-16 rounded-2xl border-2 border-navy bg-gradient-to-br from-rose-200 to-rose-400" />
        <div className="h-16 w-16 rounded-2xl border-2 border-navy bg-gradient-to-br from-emerald-200 to-emerald-400" />
      </div>

      <button className="mt-4 flex w-full items-center justify-between rounded-full border border-navy-foreground/20 bg-navy-foreground/5 px-4 py-2.5 text-small text-navy-foreground hover:bg-navy-foreground/10">
        Kampanya Detayları
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <ArrowRight className="h-4 w-4" />
        </span>
      </button>
    </section>
  );
}
