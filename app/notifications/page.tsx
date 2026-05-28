"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  isRead: boolean;
  createdAt: string;
}

interface Result {
  items: Notification[];
  unreadCount: number;
}

export default function NotificationsPage() {
  const [data, setData] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/proxy/notifications")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData({ items: [], unreadCount: 0 }))
      .finally(() => setLoading(false));
  }, []);

  function markAllRead() {
    fetch("/api/proxy/notifications/read-all", { method: "POST" }).then(() => {
      setData((prev) =>
        prev
          ? { ...prev, items: prev.items.map((n) => ({ ...n, isRead: true })), unreadCount: 0 }
          : prev,
      );
    });
  }

  function markRead(id: string) {
    fetch(`/api/proxy/notifications/${id}/read`, { method: "POST" });
    setData((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
            unreadCount: Math.max(0, prev.unreadCount - 1),
          }
        : prev,
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container-folkie py-10 lg:py-16">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-h2">Notifications</h1>
            </div>
            {data && data.unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-small font-semibold text-primary hover:underline"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </button>
            )}
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !data || data.items.length === 0 ? (
              <div className="card-folkie p-8 text-center">
                <Bell className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-small font-semibold">No notifications</p>
                <p className="mt-1 text-caption text-muted-foreground">
                  You&apos;re all caught up.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {data.items.map((n) => (
                  <li
                    key={n.id}
                    onClick={() => !n.isRead && markRead(n.id)}
                    className={`card-folkie cursor-pointer p-4 transition-colors ${
                      n.isRead ? "opacity-60" : "border-l-2 border-l-primary"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-small font-semibold">{n.title}</p>
                        {n.body && (
                          <p className="mt-0.5 text-caption text-muted-foreground">
                            {n.body}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-caption text-muted-foreground">
                        {new Date(n.createdAt).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6">
            <Link href="/" className="text-small text-muted-foreground hover:text-primary">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
