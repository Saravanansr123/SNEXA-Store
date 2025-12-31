import { motion } from "framer-motion";

const features = [
  "Premium Fabric",
  "Tailored Fit",
  "Breathable Design",
  "All-Day Comfort",
];

export default function GlassFeatureStrip() {
  return (
    <section className="py-32 bg-black">
      <div className="max-w-6xl mx-auto flex flex-wrap gap-6 justify-center">
        {features.map((f, i) => (
          <motion.div
            key={f}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="px-8 py-4 rounded-full
              bg-white/5 backdrop-blur-md
              border border-white/20 text-white/80
              shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]"
          >
            {f}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
