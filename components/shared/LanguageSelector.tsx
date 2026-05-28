"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

const PREF_KEY = "folkie_lang_pref";

export function LanguageSelector() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const pref = localStorage.getItem(PREF_KEY);
    if (!pref) {
      // small delay so page loads first
      const t = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function pick(lang: "en" | "tr") {
    localStorage.setItem(PREF_KEY, lang);
    setShow(false);
    if (lang === "tr") {
      // Turkish version is coming soon — show a note but stay on English
      alert("Türkçe sürüm yakında! For now we'll continue in English.");
    }
  }

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
      onClick={() => { localStorage.setItem(PREF_KEY, "en"); setShow(false); }}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
            <Globe className="h-7 w-7 text-primary" />
          </div>
        </div>

        <h2 className="mt-5 text-center text-h3">
          Choose your language
          <span className="mt-1 block text-small font-normal text-muted-foreground">
            Dilinizi seçin
          </span>
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => pick("en")}
            className="flex flex-col items-center gap-2 rounded-2xl border-2 border-primary bg-primary-light px-4 py-5 hover:bg-primary/10"
          >
            <span className="text-2xl">🇬🇧</span>
            <span className="text-small font-semibold text-primary">English</span>
          </button>
          <button
            onClick={() => pick("tr")}
            className="flex flex-col items-center gap-2 rounded-2xl border-2 border-border bg-background px-4 py-5 hover:border-primary/50"
          >
            <span className="text-2xl">🇹🇷</span>
            <span className="text-small font-semibold">Türkçe</span>
            <span className="text-[10px] text-muted-foreground">Yakında</span>
          </button>
        </div>

        <p className="mt-4 text-center text-caption text-muted-foreground">
          You can change this anytime in settings.
        </p>
      </div>
    </div>
  );
}
