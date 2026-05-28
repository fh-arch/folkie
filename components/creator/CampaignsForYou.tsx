"use client";

import { useState } from "react";
import {
  Bookmark,
  Sparkles,
  ChevronDown,
  Search,
  SlidersHorizontal,
  Send,
  Calendar,
  Users,
} from "lucide-react";
import { cn, formatTRY } from "@/lib/utils";

interface Campaign {
  id: string;
  brandName: string;
  brandLogo: string;
  title: string;
  category: string;
  budget: number;
  influencerCount: number;
  applicationDeadline: string;
  matchScore: number;
  isNanoOnly?: boolean;
}

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    brandName: "Lokal Coffee",
    brandLogo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=120",
    title: "Yaz İçecekleri Lansmanı",
    category: "Yemek & İçecek",
    budget: 2500,
    influencerCount: 50,
    applicationDeadline: "5 gün",
    matchScore: 96,
    isNanoOnly: true,
  },
  {
    id: "2",
    brandName: "Mavi Jeans",
    brandLogo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120",
    title: "Yeni Sezon Pantolon Koleksiyonu",
    category: "Moda",
    budget: 4500,
    influencerCount: 25,
    applicationDeadline: "3 gün",
    matchScore: 89,
  },
  {
    id: "3",
    brandName: "Nivea TR",
    brandLogo: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=120",
    title: "Yaz Güneş Kremi Kampanyası",
    category: "Güzellik & Bakım",
    budget: 3200,
    influencerCount: 100,
    applicationDeadline: "8 gün",
    matchScore: 84,
    isNanoOnly: true,
  },
];

const TABS = ["Sana Özel", "Tümü", "Nano Fırsatlar", "Davetler"];

export function CampaignsForYou() {
  const [activeTab, setActiveTab] = useState("Sana Özel");

  return (
    <section className="card-folkie p-5">
      <div className="flex flex-wrap items-center gap-4 border-b border-border pb-4">
        <h3 className="text-h3 mr-2">Kampanyalar</h3>
        <nav className="flex items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative px-3 py-1.5 text-small font-medium transition-colors",
                activeTab === tab
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-accent" />
              )}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Kampanya ara..."
              className="h-9 w-56 rounded-full border border-border bg-background pl-9 pr-3 text-small placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-small hover:border-primary">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtrele
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_CAMPAIGNS.map((c) => (
          <CampaignCardItem key={c.id} campaign={c} />
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button className="flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2 text-small font-medium hover:border-primary">
          Tüm Kampanyaları Gör
        </button>
      </div>
    </section>
  );
}

function CampaignCardItem({ campaign }: { campaign: Campaign }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-background transition-all hover:shadow-lg">
      {/* Logo + match score header */}
      <div className="relative h-24 bg-gradient-to-br from-primary-light to-muted px-4 py-3">
        <div className="flex items-start justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={campaign.brandLogo}
            alt={campaign.brandName}
            className="h-12 w-12 rounded-full border-2 border-card bg-card object-cover"
          />
          <div className="flex items-center gap-2">
            {campaign.isNanoOnly && (
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-caption font-semibold text-accent-foreground">
                Nano
              </span>
            )}
            <button
              className="flex h-7 w-7 items-center justify-center rounded-full bg-card hover:bg-card/80"
              aria-label="Kaydet"
            >
              <Bookmark className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <span className="absolute bottom-2 right-3 flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-caption">
          <Sparkles className="h-3 w-3 text-primary" />
          <span className="font-semibold text-primary">%{campaign.matchScore}</span>
          <span className="text-muted-foreground">eşleşme</span>
        </span>
      </div>

      <div className="p-4">
        <div className="text-caption text-muted-foreground">{campaign.brandName}</div>
        <h4 className="mt-0.5 line-clamp-2 text-body font-semibold">
          {campaign.title}
        </h4>
        <div className="mt-1 text-caption text-muted-foreground">
          {campaign.category}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3">
          <div>
            <div className="flex items-center gap-1 text-caption text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Son başvuru
            </div>
            <div className="text-small font-semibold">{campaign.applicationDeadline}</div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-caption text-muted-foreground">
              <Users className="h-3 w-3" />
              Kontenjan
            </div>
            <div className="text-small font-semibold">
              {campaign.influencerCount} creator
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-caption text-muted-foreground">Ücret</div>
            <div className="text-body font-bold text-primary">
              {formatTRY(campaign.budget)}
            </div>
          </div>
          <button className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hover:bg-primary/90">
            <Send className="h-3.5 w-3.5" />
            Başvur
          </button>
        </div>
      </div>
    </article>
  );
}
