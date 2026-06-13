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

  // Logged out: floating pill navbar (matches hero design)
  return (
    <nav className="nav-float">
      <div className="nav-pill">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 group"
          style={{ textDecoration: "none" }}
        >
          <span className="logo-mark" aria-hidden>
            <span className="logo-mark-outer" />
            <span className="logo-mark-inner" />
          </span>
          <span
            className="font-display"
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#ffffff",
              letterSpacing: "-0.01em",
            }}
          >
            DSA AI
          </span>
        </Link>

        {isLanding && (
          <ul className="nav-links">
            <li><a href="#curriculum" className="nav-link">Curriculum</a></li>
            <li><a href="#how" className="nav-link">How it works</a></li>
            <li><a href="#difference" className="nav-link">The difference</a></li>
          </ul>
        )}

        <button onClick={signInWithGoogle} className="btn-light btn-light-sm shrink-0">
          Start for free
        </button>
      </div>
    </nav>
  );
}
