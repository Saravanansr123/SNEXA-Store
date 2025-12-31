import { useEffect, useState, CSSProperties } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import { Navigation } from "../components/Navigation";
import BannerHeroLayout from "../images/Banner Hero Layout.png";
import ProductivitySlider from "../components/ProductivitySlider";
import MorphingText from "../components/MorphingText";
import LumaIntroHero from "../components/LumaIntroHero";
import LumaSplitPanels from "../components/LumaSplitPanels";
import LumaStatement from "../components/LumaStatement";
import GlassProductSpotlight from "../components/GlassProductSpotlight";
import FloatingGlassProducts from "../components/FloatingGlassProducts";
import GlassFeatureStrip from "../components/GlassFeatureStrip";
import { SmoothScrollProductSection } from "../components/SmoothScrollProductSection";
import  CircularText  from "../components/ui/CircularText";

interface HomePageSnapProps {
  onNavigate: (page: string) => void;
}

const carouselImages = [
  "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg",
  "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg",
  "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg",
];

/* ================= LUMA BOTTOM SCROLL REVEAL ================= */
const reveal: HTMLMotionProps<"div"> = {
  initial: {
    opacity: 0,
    y: 48,        // 👈 from bottom
    scale: 0.98,  // subtle settle
  },
  whileInView: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  viewport: {
    once: true,
    margin: "0px 0px -30% 0px", // early trigger (no late reveal)
  },
  transition: {
    duration: 0.55,
    ease: [0.16, 1, 0.3, 1], // Luma easing
  },
};

export default function HomePageSnap({ onNavigate }: HomePageSnapProps) {
  const [index, setIndex] = useState(0);

  /* ================= HERO SCROLL ================= */
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 160], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 160], [1, 1.03]);
  const heroTextY = useTransform(scrollY, [0, 160], [0, -36]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((p) => (p + 1) % carouselImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const maskStyle: CSSProperties = {
    WebkitMaskImage: `url(${BannerHeroLayout})`,
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    WebkitMaskSize: "contain",
    maskImage: `url(${BannerHeroLayout})`,
    maskRepeat: "no-repeat",
    maskPosition: "center",
    maskSize: "contain",
  };

  return (
    <main className="bg-black text-white overflow-hidden">
      {/* ================= NAVBAR ================= */}
      <div className="fixed inset-x-0 top-0 z-50">
        <Navigation currentPage="home" onNavigate={onNavigate} />
      </div>

      {/* ================= INTRO HERO ================= */}
      <LumaIntroHero />

      {/* ================= SECTIONS ================= */}

      <section className="py-32">
        <motion.div {...reveal}>
          <ProductivitySlider onNavigate={onNavigate} />
        </motion.div>
      </section>

      <section className="py-32">
        <motion.div {...reveal}>
          <MorphingText />
        </motion.div>
      </section>

      <section className="py-32">
        <motion.div {...reveal}>
          <FloatingGlassProducts />
        </motion.div>
      </section>

      <section className="py-32">
        <motion.div {...reveal}>
          <LumaSplitPanels />
        </motion.div>
      </section>

      <section className="py-32">
        <motion.div {...reveal}>
          <LumaStatement />
        </motion.div>
      </section>

      <section className="py-32">
        <motion.div {...reveal}>
          <GlassProductSpotlight />
        </motion.div>
      </section>

      <section className="py-32">
        <motion.div {...reveal}>
          <GlassFeatureStrip />
        </motion.div>
      </section>

      {/* ================= CATEGORY GRID ================= */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 py-32 px-6">
        {["Mens", "Womens", "Kids"].map((title, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, x: 32, y: 32 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -30% 0px" }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
              delay: i * 0.06,
            }}
            className="
              relative aspect-[3/4] rounded-[36px] overflow-hidden
              bg-black border border-white/10
              hover:scale-[1.03] transition-all will-change-transform
            "
          >
            <img
              src={carouselImages[i]}
              className="absolute inset-0 w-full h-full object-cover scale-110"
              alt={title}
            />
            <div className="absolute inset-0 bg-black/50" />
            <div
              className="
                absolute bottom-6 left-6 right-6
                bg-white/5 backdrop-blur-xl border border-white/20
                rounded-full p-4 text-center
              "
            >
              <h3 className="tracking-wide">{title}</h3>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ================= SMOOTH SCROLL STORY ================= */}
      <SmoothScrollProductSection />

      {/* ================= NEWSLETTER ================= */}
      <section
        className="
          mx-auto max-w-5xl rounded-[64px]
          bg-neutral-900 py-20 text-center mb-32
        "
      >
        <h2 className="text-2xl">Join SNEXA Club</h2>
        <p className="mt-2 text-white/60">
          Early access & private drops
        </p>

        <div className="mt-8 flex justify-center">
          <input
            placeholder="Your email"
            className="rounded-l-full px-6 py-3 text-black outline-none"
          />
          <button className="rounded-r-full bg-white px-6 text-black">
            Subscribe
          </button>
        </div>
      </section>
      
      <div className="fixed bottom-6 right-6 z-[70]">
  <div className="relative w-[220px] h-[220px]">
    <CircularText
      text="SNEXA • PREMIUM • FASHIONS • "
      spinDuration={20}
      className="text-white/70"
    />

    <div className="absolute inset-0 flex items-center justify-center">
      <button className="w-14 h-14 rounded-full bg-black text-black shadow-xl">
        
      </button>
    </div>
  </div>
</div>

    </main>
  );
}
