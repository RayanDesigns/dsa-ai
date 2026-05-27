import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DSA for AI Engineering",
  description: "Master data structures and algorithms through the lens of AI engineering — in under 6 hours.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)] antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "rgba(20,23,33,0.92)",
                backdropFilter: "blur(16px)",
                color: "#eceef4",
                border: "1px solid #1c2033",
                borderRadius: "14px",
                fontSize: "13.5px",
                fontFamily: "var(--font-plus-jakarta), sans-serif",
                padding: "12px 16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              },
              success: { iconTheme: { primary: "#10b981", secondary: "#09090e" } },
              error:   { iconTheme: { primary: "#f87171", secondary: "#09090e" } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
