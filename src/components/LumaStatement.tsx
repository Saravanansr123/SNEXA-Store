import { motion } from "framer-motion";

export default function LumaStatement() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      viewport={{ once: true }}
      className="py-60 text-center bg-black relative"
    >
      <h2 className="text-5xl md:text-6xl font-light text-white">
        Fashion, refined
      </h2>

      <p className="mt-6 text-white/60 max-w-xl mx-auto">
        Crafted experiences that move with you.
      </p>

      <div className="absolute inset-0 pointer-events-none
        bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_70%)]" />
    </motion.section>
  );
}
