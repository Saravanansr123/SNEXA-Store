import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function GlassProductSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  /* Faster, tighter motion */
  const scale = useTransform(scrollYProgress, [0, 0.6], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.6], [60, 0]);

  return (
    <section
      ref={ref}
      className="
        relative bg-black
        h-[80vh] md:h-[80vh]
      "
    >
      <motion.div
        style={{ scale, opacity, y }}
        className="
          sticky top-[10vh]
          h-[80vh]
          flex items-center justify-center
        "
      >
        <div
          className="
            relative max-w-5xl w-full
            rounded-[48px]
            bg-white/5 backdrop-blur-2xl
            border border-white/20
            shadow-[0_40px_120px_rgba(0,0,0,0.6)]
            px-8 py-14 md:p-16
            text-center
          "
        >
          <p className="uppercase tracking-widest text-white/50 text-xs">
            Featured Drop
          </p>

          <h2 className="mt-6 text-4xl md:text-6xl font-light text-white">
            Midnight Urban Jacket
          </h2>

          <p className="mt-6 text-white/60 max-w-xl mx-auto">
            Sculpted silhouettes. Premium fabric. Designed to move with you.
          </p>

          <button
            className="
              mt-10 px-10 py-4 rounded-full
              bg-white text-black text-sm font-medium
              hover:scale-105 transition
            "
          >
            View Product
          </button>
        </div>
      </motion.div>

      {/* Ambient glow */}
      <div
        className="
          absolute inset-0 pointer-events-none
          bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_65%)]
        "
      />
    </section>
  );
}
