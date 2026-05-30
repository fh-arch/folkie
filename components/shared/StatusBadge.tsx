import { cn } from "@/lib/utils";

type Variant =
  | "draft"
  | "pending"
  | "active"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "approved"
  | "rejected"
  | "withdrawn"
  | "submitted"
  | "revision"
  | "revision_requested"
  | "published"
  | "transferred"
  | "received"
  | "failed";

const STYLES: Record<Variant, { bg: string; fg: string; label: string }> = {
  draft:        { bg: "bg-muted",            fg: "text-muted-foreground", label: "Draft" },
  pending:      { bg: "bg-warning/15",       fg: "text-warning",          label: "Pending" },
  active:       { bg: "bg-success/15",       fg: "text-success",          label: "Active" },
  in_progress:  { bg: "bg-primary-light",    fg: "text-primary",          label: "In Progress" },
  completed:    { bg: "bg-primary-light",    fg: "text-primary",          label: "Completed" },
  cancelled:    { bg: "bg-destructive/15",   fg: "text-destructive",      label: "Cancelled" },
  approved:     { bg: "bg-success/15",       fg: "text-success",          label: "Approved" },
  rejected:     { bg: "bg-destructive/15",   fg: "text-destructive",      label: "Rejected" },
  withdrawn:    { bg: "bg-muted",            fg: "text-muted-foreground", label: "Withdrawn" },
  submitted:    { bg: "bg-warning/15",       fg: "text-warning",          label: "Submitted" },
  revision:          { bg: "bg-accent/30", fg: "text-foreground", label: "Revision" },
  revision_requested: { bg: "bg-accent/30", fg: "text-foreground", label: "Revision" },
  published:    { bg: "bg-success/15",       fg: "text-success",          label: "Published" },
  transferred:  { bg: "bg-success/15",       fg: "text-success",          label: "Transferred" },
  received:     { bg: "bg-success/15",       fg: "text-success",          label: "Received" },
  failed:       { bg: "bg-destructive/15",   fg: "text-destructive",      label: "Failed" },
};

export function StatusBadge({
  variant,
  label,
  className,
}: {
  variant: Variant;
  label?: string;
  className?: string;
}) {
  const s = STYLES[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-semibold",
        s.bg,
        s.fg,
        className,
      )}
    >
      {label ?? s.label}
    </span>
  );
}
