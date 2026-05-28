"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProgressStore } from "@/store/progress";
import { XPBar } from "@/components/gamification/XPBar";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { user, signOutUser, signInWithGoogle } = useAuth();
  const progress = useProgressStore((s) => s.progress);
  const pathname = usePathname();
  const isLanding = pathname === "/" && !user;

  return (
    <nav
      className="sticky top-0 z-40"
      style={{
        borderBottom: "1px solid rgba(28,32,51,0.8)",
        background: "rgba(9,9,14,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 group"
          style={{ textDecoration: "none" }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(124,106,247,0.3) 0%, rgba(124,106,247,0.12) 100%)",
              border: "1px solid rgba(124,106,247,0.3)",
              boxShadow: "0 0 12px rgba(124,106,247,0.15)",
            }}
          >
            <span
              className="font-display font-bold"
              style={{ fontSize: "11px", color: "#9585ff", letterSpacing: "0.02em" }}
            >
              D
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-display font-bold"
              style={{ fontSize: "15px", color: "var(--color-text-primary)", letterSpacing: "-0.01em" }}
            >
              DSA
            </span>
            <span
              className="font-sans"
              style={{ fontSize: "12px", color: "var(--color-text-tertiary)", fontWeight: 400 }}
            >
              for AI
            </span>
          </div>
        </Link>

        {/* Nav links — landing page only */}
        {isLanding && (
          <ul style={{ display: "flex", alignItems: "center", gap: "32px", listStyle: "none", margin: 0, padding: 0 }}>
            <li>
              <a
                href="#curriculum"
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)"; }}
              >
                Curriculum
              </a>
            </li>
            <li>
              <a
                href="#how"
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)"; }}
              >
                How it works
              </a>
            </li>
          </ul>
        )}

        {/* XP bar (center) */}
        {progress && !isLanding && (
          <div className="hidden sm:flex">
            <XPBar xp={progress.totalXP} />
          </div>
        )}

        {/* Landing CTA buttons */}
        {isLanding && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={signInWithGoogle}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 16px",
                borderRadius: "8px",
                fontFamily: "var(--font-sans)",
                fontSize: "13.5px",
                fontWeight: 600,
                background: "transparent",
                color: "var(--color-text-secondary)",
                border: "1px solid var(--color-border)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--color-bg-card)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
              }}
            >
              Sign in
            </button>
            <button
              onClick={signInWithGoogle}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 16px",
                borderRadius: "8px",
                fontFamily: "var(--font-sans)",
                fontSize: "13.5px",
                fontWeight: 600,
                background: "var(--color-accent)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(124,106,247,0.3)",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--color-accent-hover)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 28px rgba(124,106,247,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--color-accent)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(124,106,247,0.3)";
              }}
            >
              Start for free
            </button>
          </div>
        )}

        {/* User section */}
        {user && (
          <div className="flex items-center gap-2.5">
            {user.photoURL && (
              <div
                className="rounded-full overflow-hidden"
                style={{
                  border: "1.5px solid rgba(28,32,51,0.9)",
                  boxShadow: "0 0 0 2px rgba(124,106,247,0.15)",
                }}
              >
                <Image
                  src={user.photoURL}
                  alt={user.displayName ?? ""}
                  width={28}
                  height={28}
                  className="rounded-full block"
                />
              </div>
            )}
            <button
              onClick={signOutUser}
              className="p-1.5 rounded-lg transition-all duration-150"
              style={{ color: "var(--color-text-tertiary)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--color-error)";
                (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--color-text-tertiary)";
                (e.currentTarget as HTMLElement).style.background = "";
              }}
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
