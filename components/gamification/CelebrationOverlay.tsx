"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

interface CelebrationOverlayProps {
  show: boolean;
  xpEarned: number;
  challengeTitle: string;
  nextChallenge: { slug: string; title: string } | null;
  onDismiss: () => void;
}

const CONFETTI_COUNT = 48;

type Piece = {
  x: number;
  initialY: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotate: number;
  shape: "rect" | "circle";
};

const COLORS = [
  "#7c6af7", "#9585ff", "#f59e0b", "#10b981",
  "#3b82f6", "#ec4899", "#f97316", "#a78bfa",
];

function useConfetti(show: boolean) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!show) { setPieces([]); return; }
    const generated: Piece[] = Array.from({ length: CONFETTI_COUNT }, () => ({
      x: Math.random() * 100,
      initialY: -10 - Math.random() * 20,
      delay: Math.random() * 0.8,
      duration: 1.8 + Math.random() * 1.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 360,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));
    setPieces(generated);
  }, [show]);

  return pieces;
}

export function CelebrationOverlay({
  show,
  xpEarned,
  challengeTitle,
  nextChallenge,
  onDismiss,
}: CelebrationOverlayProps) {
  const pieces = useConfetti(show);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (show) {
      timerRef.current = setTimeout(onDismiss, 4500);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [show, onDismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backdropFilter: "blur(6px)", background: "rgba(7,9,15,0.78)" }}
          onClick={onDismiss}
        >
          {/* Confetti */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {pieces.map((p, i) => (
              <motion.div
                key={i}
                initial={{ x: `${p.x}vw`, y: `${p.initialY}vh`, rotate: p.rotate, opacity: 1 }}
                animate={{ y: "110vh", rotate: p.rotate + 360 * (Math.random() > 0.5 ? 1 : -1), opacity: [1, 1, 0] }}
                transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
                style={{
                  position: "absolute",
                  width: p.size,
                  height: p.shape === "rect" ? p.size * 0.5 : p.size,
                  borderRadius: p.shape === "circle" ? "50%" : "2px",
                  background: p.color,
                  top: 0,
                  left: 0,
                }}
              />
            ))}
          </div>

          {/* Card */}
          <motion.div
            initial={{ scale: 0.82, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -16 }}
            transition={{ duration: 0.38, ease: [0.2, 0, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm mx-4 rounded-2xl p-8 text-center"
            style={{
              background: "linear-gradient(160deg, #0f1120 0%, #13161f 100%)",
              border: "1px solid rgba(124,106,247,0.35)",
              boxShadow: "0 0 80px rgba(124,106,247,0.2), 0 0 0 1px rgba(124,106,247,0.1), 0 32px 64px rgba(0,0,0,0.6)",
            }}
          >
            {/* Glow ring behind checkmark */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 0%, rgba(124,106,247,0.15) 0%, transparent 60%)",
              }}
            />

            {/* Check icon */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, duration: 0.45, type: "spring", stiffness: 220, damping: 14 }}
              className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4"
              style={{ background: "rgba(16,185,129,0.12)", border: "1.5px solid rgba(16,185,129,0.3)" }}
            >
              <CheckCircle2 size={32} style={{ color: "#10b981" }} />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display font-bold mb-1"
              style={{ fontSize: "1.4rem", color: "var(--color-text-primary)", letterSpacing: "-0.01em" }}
            >
              Challenge Complete!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.26 }}
              className="text-sm mb-5"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {challengeTitle}
            </motion.p>

            {/* XP badge */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.32, type: "spring", stiffness: 260, damping: 16 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl mb-6"
              style={{
                background: "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.08) 100%)",
                border: "1px solid rgba(245,158,11,0.3)",
              }}
            >
              <Zap size={16} style={{ color: "#f59e0b" }} />
              <span
                className="font-display font-bold tabular-nums"
                style={{ fontSize: "1.5rem", color: "#f59e0b", letterSpacing: "-0.02em" }}
              >
                +{xpEarned} XP
              </span>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
            >
              {nextChallenge ? (
                <Link href={`/challenge/${nextChallenge.slug}`} onClick={onDismiss}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #7c6af7 0%, #9585ff 100%)",
                      boxShadow: "0 4px 24px rgba(124,106,247,0.5), 0 0 0 1px rgba(124,106,247,0.2)",
                    }}
                  >
                    Next: {nextChallenge.title}
                    <ArrowRight size={15} />
                  </motion.div>
                </Link>
              ) : (
                <Link href="/" onClick={onDismiss}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #7c6af7 0%, #9585ff 100%)",
                      boxShadow: "0 4px 24px rgba(124,106,247,0.5)",
                    }}
                  >
                    All done — back to curriculum
                    <ArrowRight size={15} />
                  </motion.div>
                </Link>
              )}
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={onDismiss}
              className="mt-3 text-xs w-full py-1 transition-colors duration-150"
              style={{ color: "#2d3557" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#6b7689")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#2d3557")}
            >
              keep editing
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
