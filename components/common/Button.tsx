import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type BaseProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkButtonProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const styles = {
  primary:
    "bg-cyan-400 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.25)] hover:bg-cyan-300",
  secondary:
    "border border-cyan-300/30 bg-cyan-300/10 text-cyan-100 hover:border-cyan-200/70 hover:bg-cyan-300/15",
  ghost:
    "border border-white/10 bg-white/[0.03] text-slate-100 hover:border-white/20 hover:bg-white/[0.07]",
  danger:
    "border border-rose-300/30 bg-rose-400/10 text-rose-100 hover:bg-rose-400/15",
};

const base =
  "inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50";

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({ children, variant = "primary", className = "", href, ...props }: LinkButtonProps) {
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
