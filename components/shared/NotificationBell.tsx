"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  dataJson: string | null;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsResult {
  items: Notification[];
  unreadCount: number;
}

const POLL_INTERVAL_MS = 30_000; // 30 saniyede bir refresh

export function NotificationBell() {
  const [data, setData] = useState<NotificationsResult>({ items: [], unreadCount: 0 });
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Initial fetch + polling
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const res = await fetch("/api/proxy/notifications?limit=20");
        if (res.ok && !cancelled) {
          setData(await res.json());
        }
      } catch {
        /* network blip */
      }
    };
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function markRead(id: string) {
    await fetch("/api/proxy/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setData((d) => ({
      items: d.items.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      unreadCount: Math.max(0, d.unreadCount - 1),
    }));
  }

  async function markAllRead() {
    await fetch("/api/proxy/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "read-all" }),
    });
    setData((d) => ({
      items: d.items.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card hover:bg-muted"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {data.unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-accent-foreground">
            {data.unreadCount > 99 ? "99+" : data.unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-body font-semibold">Notifications</h3>
            {data.unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-caption text-primary hover:underline"
              >
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>

          {data.items.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-2 text-small text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            <ul className="max-h-[400px] overflow-y-auto">
              {data.items.map((n) => (
                <li
                  key={n.id}
                  onClick={() => !n.isRead && markRead(n.id)}
                  className={`cursor-pointer border-b border-border px-4 py-3 transition-colors hover:bg-muted ${
                    !n.isRead ? "bg-primary-light/40" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.isRead && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-small font-semibold">{n.title}</div>
                      {n.body && (
                        <p className="mt-0.5 line-clamp-2 text-caption text-muted-foreground">
                          {n.body}
                        </p>
                      )}
                      <span className="mt-1 block text-caption text-muted-foreground">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/notifications"
            className="flex items-center justify-center border-t border-border py-2 text-caption text-primary hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB");
}
