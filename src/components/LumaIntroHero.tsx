import { motion, useScroll, useTransform } from "framer-motion";

export default function LumaIntroHero() {
  const { scrollY } = useScroll();

  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.15]);
  const y = useTransform(scrollY, [0, 300], [0, -80]);

  return (
    <motion.section
      style={{ opacity, scale }}
      className="h-[80vh] flex items-center justify-center bg-black relative"
    >
      <motion.div style={{ y }} className="text-center">
        <h1 className="text-[14vw] font-light tracking-[0.3em] text-white">
          SNEXA
        </h1>
        <p className="mt-6 text-white/60 tracking-wide">
          Designed for the future of fashion
        </p>
      </motion.div>

      {/* ambient glow */}
      <div className="absolute inset-0 pointer-events-none
        bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]" />
    </motion.section>
  );
}
