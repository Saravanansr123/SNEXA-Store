import { motion } from "framer-motion";

export default function DarkroomPriceReveal() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.1 }}
      viewport={{ once: true }}
      className="py-48 text-center bg-black relative"
    >
      <p className="text-white/50 tracking-widest text-xs">
        Starting from
      </p>

      <h2 className="mt-6 text-6xl font-light text-white">
        ₹1,999
      </h2>

      <button className="mt-10 px-12 py-4 rounded-full
        bg-white text-black text-sm font-medium
        hover:scale-105 transition">
        Shop Collection
      </button>

      <div className="absolute inset-0 pointer-events-none
        bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_65%)]" />
    </motion.section>
  );
}
