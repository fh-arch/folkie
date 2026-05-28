"use client";

import { useTransition } from "react";
import { Heart, Loader2 } from "lucide-react";
import { removeFavorite } from "./actions";

export function RemoveFavoriteButton({ creatorId }: { creatorId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await removeFavorite(creatorId);
        })
      }
      disabled={pending}
      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/95 backdrop-blur disabled:opacity-50"
      aria-label="Favorilerden çıkar"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className="h-4 w-4 fill-destructive text-destructive" />
      )}
    </button>
  );
}
