"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProgressStore } from "@/store/progress";
import { XPBar } from "@/components/gamification/XPBar";
import { LogOut } from "lucide-react";

export function Navbar() {
  const { user, signOutUser } = useAuth();
  const progress = useProgressStore((s) => s.progress);

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg shrink-0">
          <span className="text-[var(--color-accent)]">DSA</span>
          <span className="text-[var(--color-text-secondary)] font-normal text-sm">for AI</span>
        </Link>

        {/* XP bar (center) */}
        {progress && (
          <div className="hidden sm:flex">
            <XPBar xp={progress.totalXP} />
          </div>
        )}

        {/* User */}
        {user && (
          <div className="flex items-center gap-3">
            {user.photoURL && (
              <Image
                src={user.photoURL}
                alt={user.displayName ?? ""}
                width={28}
                height={28}
                className="rounded-full"
              />
            )}
            <button
              onClick={signOutUser}
              className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card)] transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
