import { motion } from "framer-motion";

export default function LumaSplitPanels() {
  return (
    <section className="grid md:grid-cols-2 min-h-screen bg-black">
      {[
        { title: "Minimal", desc: "Reduced to what matters" },
        { title: "Immersive", desc: "Designed for focus" },
      ].map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: i * 0.1 }}
          className="flex items-center justify-center p-20 border border-white/10"
        >
          <div>
            <h3 className="text-5xl font-light text-white">
              {item.title}
            </h3>
            <p className="mt-4 text-white/60 max-w-sm">
              {item.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
