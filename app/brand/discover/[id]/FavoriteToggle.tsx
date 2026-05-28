"use client";

import { useState, useTransition } from "react";
import { Heart, Bookmark } from "lucide-react";
import { addFavorite, removeFavorite } from "../../favorites/actions";

export function FavoriteToggle({
  creatorId,
  initialFavorited,
}: {
  creatorId: string;
  initialFavorited: boolean;
}) {
  const [isFav, setIsFav] = useState(initialFavorited);
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      if (isFav) {
        const r = await removeFavorite(creatorId);
        if (r.ok) setIsFav(false);
      } else {
        const r = await addFavorite(creatorId, null);
        if (r.ok) setIsFav(true);
      }
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-small font-semibold hover:border-destructive hover:text-destructive disabled:opacity-50"
    >
      {isFav ? (
        <Heart className="h-3.5 w-3.5 fill-destructive text-destructive" />
      ) : (
        <Bookmark className="h-3.5 w-3.5" />
      )}
      {isFav ? "Saved" : "Save"}
    </button>
  );
}
