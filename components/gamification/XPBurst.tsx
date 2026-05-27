"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface XPBurstProps {
  amount: number;
  trigger: boolean;
}

const SPARKS = [
  { angle: -80, dist: 70, delay: 0.0, size: 6 },
  { angle: -40, dist: 90, delay: 0.05, size: 5 },
  { angle: -10, dist: 80, delay: 0.0, size: 7 },
  { angle: 25,  dist: 85, delay: 0.08, size: 5 },
  { angle: 55,  dist: 75, delay: 0.02, size: 6 },
  { angle: 80,  dist: 65, delay: 0.06, size: 4 },
  { angle: -60, dist: 60, delay: 0.1,  size: 4 },
];

function toXY(angle: number, dist: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: Math.sin(rad) * dist, y: -Math.cos(rad) * dist };
}

export function XPBurst({ amount, trigger }: XPBurstProps) {
  const [key, setKey] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setKey((k) => k + 1);
      setShow(true);
      const t = setTimeout(() => setShow(false), 1800);
      return () => clearTimeout(t);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {show && (
        <div
          key={key}
          className="pointer-events-none fixed bottom-24 right-10 z-50"
        >
          {/* Radial flash */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0.7 }}
            animate={{ scale: 2.8, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(245,158,11,0.5) 0%, transparent 70%)",
              width: 60,
              height: 60,
              left: -30,
              top: -30,
            }}
          />

          {/* Sparks */}
          {SPARKS.map((spark, i) => {
            const { x, y } = toXY(spark.angle, spark.dist);
            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x, y, opacity: 0, scale: 0.3 }}
                transition={{
                  duration: 0.7,
                  delay: spark.delay,
                  ease: [0.2, 0.8, 0.6, 1],
                }}
                className="absolute rounded-full bg-amber-400"
                style={{
                  width: spark.size,
                  height: spark.size,
                  left: -spark.size / 2,
                  top: -spark.size / 2,
                  boxShadow: `0 0 ${spark.size * 2}px rgba(245,158,11,0.8)`,
                }}
              />
            );
          })}

          {/* Main label */}
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.7 }}
            animate={{ opacity: [0, 1, 1, 0], y: [4, 0, -10, -52], scale: [0.7, 1.15, 1, 0.9] }}
            transition={{ duration: 1.4, times: [0, 0.15, 0.6, 1], ease: "easeOut" }}
            className="absolute whitespace-nowrap font-display font-bold text-amber-400 drop-shadow-lg"
            style={{
              fontSize: "22px",
              left: "50%",
              top: "-6px",
              transform: "translateX(-50%)",
              textShadow: "0 0 20px rgba(245,158,11,0.7), 0 0 40px rgba(245,158,11,0.3)",
            }}
          >
            +{amount} XP
          </motion.div>

          {/* Emoji pop */}
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 0 }}
            animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0], y: -70 }}
            transition={{ duration: 1.1, delay: 0.1, ease: "easeOut" }}
            className="absolute text-lg"
            style={{ left: 24, top: 0 }}
          >
            ⚡
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
