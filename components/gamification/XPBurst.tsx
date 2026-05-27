"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface XPBurstProps {
  amount: number;
  trigger: boolean;
}

export function XPBurst({ amount, trigger }: XPBurstProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 1500);
      return () => clearTimeout(t);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="burst"
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -60, scale: 1.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="pointer-events-none fixed bottom-24 right-8 z-50 text-2xl font-bold text-amber-400 drop-shadow-lg"
        >
          +{amount} XP ⚡
        </motion.div>
      )}
    </AnimatePresence>
  );
}
