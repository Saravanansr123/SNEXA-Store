import { motion } from "framer-motion";

const products = [
  { title: "Urban Hoodie", price: "₹4,999" },
  { title: "Street Jacket", price: "₹6,499" },
  { title: "Modern Fit Tee", price: "₹2,199" },
];

export default function FloatingGlassProducts() {
  return (
    <section className="py-40 bg-black">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 px-6">
        {products.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: i * 0.1 }}
            className="group relative rounded-[36px]
              bg-white/5 backdrop-blur-xl border border-white/20
              p-8 hover:scale-[1.04] transition-all
              shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
          >
            <div className="aspect-square rounded-[24px]
              bg-gradient-to-br from-white/10 to-white/0 mb-6" />

            <h3 className="text-white tracking-wide">{p.title}</h3>
            <p className="text-white/50 text-sm mt-1">{p.price}</p>

            <button className="mt-6 w-full rounded-full
              border border-white/30 py-3 text-sm
              hover:bg-white hover:text-black transition">
              Add to Cart
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
