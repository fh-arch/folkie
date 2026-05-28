import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon?: LucideIcon;
  title: string;
  description?: string;
  primaryAction?: { href: string; label: string; icon?: LucideIcon };
  secondaryAction?: { href: string; label: string };
  illustration?: "default" | "search" | "inbox" | "wallet" | "celebrate";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: { wrap: "py-8",  icon: "h-12 w-12", iconBox: "h-16 w-16" },
  md: { wrap: "py-16", icon: "h-14 w-14", iconBox: "h-20 w-20" },
  lg: { wrap: "py-24", icon: "h-16 w-16", iconBox: "h-24 w-24" },
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  size = "md",
  className,
}: Props) {
  const s = SIZES[size];
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        s.wrap,
        className,
      )}
    >
      {Icon && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-primary-light text-primary",
            s.iconBox,
          )}
        >
          <Icon className={s.icon} />
        </div>
      )}
      <h3 className="mt-5 text-h3">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-small text-muted-foreground">
          {description}
        </p>
      )}
      {(primaryAction || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {primaryAction && (
            <Link
              href={primaryAction.href}
              className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-small font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {primaryAction.icon && <primaryAction.icon className="h-4 w-4" />}
              {primaryAction.label}
            </Link>
          )}
          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className="rounded-full border border-border px-5 py-2.5 text-small font-medium hover:border-primary"
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
