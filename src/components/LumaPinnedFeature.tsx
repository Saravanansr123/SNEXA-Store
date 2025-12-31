import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function LumaPinnedFeature() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });

  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={ref} className="relative h-[200vh] bg-black">
      <motion.div
        style={{ scale, opacity }}
        className="sticky top-0 h-screen flex items-center justify-center"
      >
        <div className="max-w-4xl text-center">
          <h2 className="text-6xl md:text-7xl font-light text-white">
            Built to feel effortless
          </h2>
          <p className="mt-6 text-white/60 text-lg">
            Smooth motion, cinematic pacing, zero distraction.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
