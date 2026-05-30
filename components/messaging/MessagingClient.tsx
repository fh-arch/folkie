"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Send,
  MoreVertical,
  MessageSquare,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";

interface Conversation {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherAvatarUrl: string | null;
  campaignId: string | null;
  campaignTitle: string | null;
  subject: string;
  lastMessageBody: string | null;
  lastMessageAt: string;
  unreadCount: number;
}

interface Message {
  id: string;
  senderUserId: string;
  body: string;
  isRead: boolean;
  isMine: boolean;
  createdAt: string;
}

const POLL_MS = 5000;

// Exported wrapper — Suspense required because useSearchParams() is used inside
export function MessagingClient() {
  return (
    <Suspense fallback={<div className="flex h-[70vh] items-center justify-center text-muted-foreground text-small">Loading messages...</div>}>
      <MessagingClientContent />
    </Suspense>
  );
}

function MessagingClientContent() {
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showThread, setShowThread] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // If ?userId= is in URL (e.g. from brand clicking "Message" on creator detail),
  // auto-open or create a conversation with that user.
  useEffect(() => {
    const userId = searchParams.get("userId");
    if (!userId) return;
    async function openOrCreate() {
      try {
        const res = await fetch("/api/proxy/messaging/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otherUserId: userId, subject: "Direct Message" }),
        });
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          setError(`Could not open conversation (${res.status}): ${e.error ?? "unknown error"}`);
          return;
        }
        const data = await res.json() as { id: string };
        // Reload conversation list to get full conversation details
        const listRes = await fetch("/api/proxy/messaging/conversations");
        if (listRes.ok) {
          const list = await listRes.json();
          setConversations(Array.isArray(list) ? list : []);
        }
        setActiveId(data.id);
        setShowThread(true);
      } catch (e) {
        setError(`Connection error: ${e instanceof Error ? e.message : "unknown"}`);
      }
    }
    openOrCreate();
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    async function fetchConvs() {
      try {
        const res = await fetch("/api/proxy/messaging/conversations");
        if (res.ok && !cancelled) {
          const data = await res.json();
          setConversations(Array.isArray(data) ? data : []);
        }
      } catch {}
      setLoading(false);
    }
    fetchConvs();
    const interval = setInterval(fetchConvs, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!activeId) return;
    let cancelled = false;
    async function fetchMsgs() {
      try {
        const res = await fetch(`/api/proxy/messaging/${activeId}/messages`);
        if (res.ok && !cancelled) {
          setMessages(await res.json());
        }
      } catch {}
    }
    fetchMsgs();
    const interval = setInterval(fetchMsgs, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [activeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!draft.trim() || !activeId || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/proxy/messaging/${activeId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: draft.trim() }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error ?? "Failed to send");
      }
      setDraft("");
      const msgRes = await fetch(`/api/proxy/messaging/${activeId}/messages`);
      if (msgRes.ok) setMessages(await msgRes.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <section className="card-folkie flex h-[calc(100vh-220px)] items-center justify-center lg:h-[calc(100vh-260px)]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </section>
    );
  }

  if (conversations.length === 0) {
    return (
      <section className="card-folkie">
        <EmptyState
          icon={MessageSquare}
          title="No conversations yet"
          description="Conversations appear here when you collaborate on a campaign or someone sends you a message."
          size="lg"
        />
      </section>
    );
  }

  const active = conversations.find((c) => c.id === activeId);

  return (
    <section className="card-folkie h-[calc(100vh-220px)] overflow-hidden p-0 lg:h-[calc(100vh-260px)]">
      <div className="grid h-full lg:grid-cols-[320px_1fr]">
        {/* List */}
        <aside
          className={cn(
            "flex h-full flex-col border-r border-border",
            showThread && "hidden lg:flex",
          )}
        >
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search conversations..."
                className="h-9 w-full rounded-full border border-border bg-background pl-9 pr-3 text-small focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {conversations.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => {
                    setActiveId(c.id);
                    setShowThread(true);
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-border px-3 py-3 text-left hover:bg-muted",
                    activeId === c.id && "bg-primary-light",
                  )}
                >
                  {c.otherAvatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.otherAvatarUrl}
                      alt={c.otherUserName}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-small font-semibold text-primary-foreground">
                      {c.otherUserName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-small font-semibold">
                        {c.otherUserName}
                      </span>
                      <span className="shrink-0 text-caption text-muted-foreground">
                        {timeAgo(c.lastMessageAt)}
                      </span>
                    </div>
                    {c.campaignTitle && (
                      <div className="truncate text-caption text-muted-foreground">
                        {c.campaignTitle}
                      </div>
                    )}
                    <p className="mt-0.5 truncate text-caption">
                      {c.lastMessageBody ?? "(no messages)"}
                    </p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-accent-foreground">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Thread */}
        <div className={cn("flex h-full flex-col", !showThread && "hidden lg:flex")}>
          {active ? (
            <>
              <header className="flex items-center gap-3 border-b border-border p-3">
                <button
                  onClick={() => setShowThread(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted lg:hidden"
                  aria-label="Back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-small font-semibold text-primary-foreground">
                  {active.otherUserName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-small font-semibold">
                    {active.otherUserName}
                  </div>
                  {active.campaignTitle && (
                    <div className="truncate text-caption text-muted-foreground">
                      {active.campaignTitle}
                    </div>
                  )}
                </div>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                  aria-label="More"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-caption text-muted-foreground">
                    Write the first message...
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "flex max-w-[80%] flex-col gap-1",
                        m.isMine ? "ml-auto items-end" : "items-start",
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2 text-small whitespace-pre-wrap",
                          m.isMine
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted",
                        )}
                      >
                        {m.body}
                      </div>
                      <span className="text-caption text-muted-foreground">
                        {timeAgo(m.createdAt)}
                      </span>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {error && (
                <div className="border-t border-destructive/20 bg-destructive/5 px-4 py-2 text-caption text-destructive">
                  {error}
                </div>
              )}

              <div className="border-t border-border p-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex items-end gap-2"
                >
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Write a message..."
                    rows={1}
                    className="flex-1 resize-none rounded-2xl border border-border bg-background px-4 py-2 text-small focus:border-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={sending || !draft.trim()}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    aria-label="Send"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="Select a conversation"
              description="Click one on the left to get started."
            />
          )}
        </div>
      </div>
    </section>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString("en-GB");
}
