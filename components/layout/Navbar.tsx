"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/auth/AuthProvider";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { user, signOutUser, signInWithGoogle } = useAuth();
  const pathname = usePathname();
  const isLanding = pathname === "/" && !user;

  // Logged in: just avatar + logout, no navbar chrome
  if (user) {
    return (
      <div className="flex justify-end items-center px-4 py-3 max-w-7xl mx-auto">
        {user.photoURL && (
          <div
            className="rounded-full overflow-hidden mr-2"
            style={{
              border: "1.5px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 0 2px rgba(255,255,255,0.06)",
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
        <button onClick={signOutUser} className="btn-signout" title="Sign out">
          <LogOut size={15} />
        </button>
      </div>
    );
  }

  // Logged out: full landing navbar
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
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "var(--shadow-s)",
            }}
          >
            <span
              className="font-display font-bold"
              style={{ fontSize: "11px", color: "var(--color-text-primary)", letterSpacing: "0.02em" }}
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

        {isLanding && (
          <ul style={{ display: "flex", alignItems: "center", gap: "32px", listStyle: "none", margin: 0, padding: 0 }}>
            <li><a href="#curriculum" className="nav-link">Curriculum</a></li>
            <li><a href="#how" className="nav-link">How it works</a></li>
          </ul>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={signInWithGoogle} className="btn-nav-ghost">Sign in</button>
          <button onClick={signInWithGoogle} className="btn-nav-primary">Start for free</button>
        </div>
      </div>
    </nav>
  );
}
