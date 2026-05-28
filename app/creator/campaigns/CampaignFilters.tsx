"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { KATEGORILER, SEHIRLER } from "@/lib/constants";

export function CampaignFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const city = searchParams.get("city") ?? "";
  const nanoOnly = searchParams.get("nanoOnly") === "true";

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const hasFilters = category || city || nanoOnly;

  function clearAll() {
    router.push(pathname);
  }

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-1.5 text-small font-semibold text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4" />
        Filter
      </span>

      <select
        value={category}
        onChange={(e) => setParam("category", e.target.value)}
        className="rounded-full border border-border bg-card px-4 py-1.5 text-small focus:border-primary focus:outline-none"
      >
        <option value="">All categories</option>
        {KATEGORILER.map((k) => (
          <option key={k.value} value={k.value}>
            {k.label}
          </option>
        ))}
      </select>

      <select
        value={city}
        onChange={(e) => setParam("city", e.target.value)}
        className="rounded-full border border-border bg-card px-4 py-1.5 text-small focus:border-primary focus:outline-none"
      >
        <option value="">All cities</option>
        {SEHIRLER.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <label className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-small hover:border-primary">
        <input
          type="checkbox"
          checked={nanoOnly}
          onChange={(e) => setParam("nanoOnly", e.target.checked ? "true" : "")}
          className="h-3.5 w-3.5 accent-primary"
        />
        Nano (≤10K)
      </label>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 rounded-full bg-muted px-4 py-1.5 text-small text-muted-foreground hover:bg-border"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}
