"use client";

import { useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Camera, Loader2 } from "lucide-react";

/**
 * Clerk'in setProfileImage() API'sini kullanarak avatar değiştirme.
 * R2 gerekmez — Clerk kendi CDN'inde host eder.
 * fallbackInitial: kullanıcının fotoğrafı yokken gösterilen harf.
 */
export function AvatarUpload({
  fallbackInitial,
  size = 80,
}: {
  fallbackInitial: string;
  size?: number;
}) {
  const { user, isLoaded } = useUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError("Dosya 5MB'tan büyük olamaz.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Sadece görsel dosyalar (PNG, JPG, WebP).");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      await user.setProfileImage({ file });
      await user.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız.");
    } finally {
      setUploading(false);
    }
  }

  const imageUrl = isLoaded ? user?.imageUrl : null;

  return (
    <div className="flex items-center gap-4">
      <div
        className="relative shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground"
        style={{ width: size, height: size }}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Profil fotoğrafı"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-h2 font-bold">
            {fallbackInitial.toUpperCase()}
          </div>
        )}
      </div>

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || !isLoaded}
          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-caption hover:border-primary disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Yükleniyor...
            </>
          ) : (
            <>
              <Camera className="h-3 w-3" />
              Fotoğraf değiştir
            </>
          )}
        </button>
        <p className="mt-1.5 text-caption text-muted-foreground">
          PNG, JPG, WebP — max 5MB
        </p>
        {error && (
          <p className="mt-1.5 text-caption text-destructive">{error}</p>
        )}
      </div>
    </div>
  );
}
