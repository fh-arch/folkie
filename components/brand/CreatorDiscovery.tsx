"use client";

import { useState } from "react";
import {
  Bookmark,
  CheckCircle2,
  ChevronDown,
  Grid3x3,
  List,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CreatorCard {
  id: string;
  handle: string;
  verified: boolean;
  niche: string;
  city: string;
  followers: string;
  engagement: string;
  tags: string[];
  photo: string;
  forYou?: boolean;
}

const MOCK_CREATORS: CreatorCard[] = [
  {
    id: "1",
    handle: "@irem.k",
    verified: true,
    niche: "Lifestyle",
    city: "İstanbul",
    followers: "1.2M",
    engagement: "6.2%",
    tags: ["Lifestyle", "Moda", "Seyahat"],
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    forYou: true,
  },
  {
    id: "2",
    handle: "@mertoz",
    verified: false,
    niche: "Teknoloji",
    city: "İstanbul",
    followers: "850K",
    engagement: "5.1%",
    tags: ["Teknoloji", "İnceleme", "Gadget"],
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
  },
  {
    id: "3",
    handle: "@sudeyilmaz",
    verified: false,
    niche: "Moda",
    city: "İzmir",
    followers: "620K",
    engagement: "7.8%",
    tags: ["Moda", "Güzellik", "Alışveriş"],
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
  },
  {
    id: "4",
    handle: "@burcu.foodie",
    verified: false,
    niche: "Yemek",
    city: "Ankara",
    followers: "1.5M",
    engagement: "8.3%",
    tags: ["Yemek", "Tarif", "Seyahat"],
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  },
];

const TABS = ["Tümü", "Sizin İçin", "Kaydedilenler", "Davet Edilenler"];
const FILTERS = [
  "Kategori",
  "Niş",
  "Lokasyon",
  "Takipçi Sayısı",
  "Etkileşim Oranı",
];

export function CreatorDiscovery() {
  const [activeTab, setActiveTab] = useState("Tümü");
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <section className="card-folkie p-5">
      {/* Başlık + tabs + arama */}
      <div className="flex flex-wrap items-center gap-4 border-b border-border pb-4">
        <h3 className="text-h3 mr-2">Creator Keşfet</h3>
        <nav className="flex items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative px-3 py-1.5 text-small font-medium transition-colors",
                activeTab === tab
                  ? "text-accent-foreground"
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
              placeholder="Creator ara..."
              className="h-9 w-56 rounded-full border border-border bg-background pl-9 pr-3 text-small placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex items-center rounded-full border border-border p-0.5">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "rounded-full p-1.5 transition-colors",
                view === "grid"
                  ? "bg-primary-light text-primary"
                  : "text-muted-foreground",
              )}
              aria-label="Grid"
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "rounded-full p-1.5 transition-colors",
                view === "list"
                  ? "bg-primary-light text-primary"
                  : "text-muted-foreground",
              )}
              aria-label="Liste"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filtre chip'leri */}
      <div className="flex flex-wrap items-center gap-2 py-4">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            className="flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-small hover:border-primary"
          >
            {filter}
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        ))}
        <button className="flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-small hover:border-primary">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Daha Fazla Filtre
        </button>
      </div>

      {/* Creator grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_CREATORS.map((c) => (
          <CreatorCardItem key={c.id} creator={c} />
        ))}
      </div>

      {/* Daha fazla yükle */}
      <div className="mt-6 flex justify-center">
        <button className="flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2 text-small font-medium hover:border-primary">
          <span className="text-primary">↻</span>
          Daha Fazla Creator Yükle
        </button>
      </div>
    </section>
  );
}

function CreatorCardItem({ creator }: { creator: CreatorCard }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-background transition-all hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={creator.photo}
          alt={creator.handle}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {creator.forYou && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-caption font-semibold text-primary-foreground">
            Sizin İçin
          </span>
        )}
        <button
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/95 backdrop-blur hover:bg-card"
          aria-label="Kaydet"
        >
          <Bookmark className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1">
          <span className="text-small font-semibold">{creator.handle}</span>
          {creator.verified && (
            <CheckCircle2 className="h-3.5 w-3.5 fill-primary text-primary-foreground" />
          )}
        </div>
        <div className="mt-0.5 text-caption text-muted-foreground">
          {creator.niche} • {creator.city}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <div className="text-small font-semibold">{creator.followers}</div>
            <div className="text-caption text-muted-foreground">Takipçi</div>
          </div>
          <div>
            <div className="text-small font-semibold">{creator.engagement}</div>
            <div className="text-caption text-muted-foreground">Etkileşim</div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {creator.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2 py-0.5 text-caption"
            >
              {tag}
            </span>
          ))}
        </div>

        <button className="mt-4 w-full rounded-full bg-primary py-2 text-small font-semibold text-primary-foreground hover:bg-primary/90">
          Profili İncele
        </button>
      </div>
    </article>
  );
}
