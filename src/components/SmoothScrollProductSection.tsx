import { useEffect, useRef } from "react";
import Lenis from "lenis";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  useAnimationFrame,
} from "framer-motion";

/* ================= ICON ================= */

const ArrowRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="M13 5l7 7-7 7" />
  </svg>
);

/* ================= ROOT ================= */

export const SmoothScrollProductSection = () => {
  const lenisRef = useRef<Lenis | null>(null);

  /* EXACT Lenis behavior from reference */
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.05 });
    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /* Sync Lenis with Framer Motion */
  useAnimationFrame((time) => {
    lenisRef.current?.raf(time);
  });

  return (
    <div className="bg-zinc-950">
      <Hero />
      <ProductList />
    </div>
  );
};

/* ================= HERO ================= */

const SECTION_HEIGHT = 1500;

const Hero = () => {
  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full"
    >
      <CenterImage />
      <ParallaxImages />
      <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-b from-zinc-950/0 to-zinc-950" />
    </div>
  );
};

/* ================= CENTER IMAGE ================= */

const CenterImage = () => {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, 1500], [25, 0]);
  const clip2 = useTransform(scrollY, [0, 1500], [75, 100]);

  const clipPath = useMotionTemplate`
    polygon(
      ${clip1}% ${clip1}%,
      ${clip2}% ${clip1}%,
      ${clip2}% ${clip2}%,
      ${clip1}% ${clip2}%
    )
  `;

  const backgroundSize = useTransform(
    scrollY,
    [0, SECTION_HEIGHT + 500],
    ["170%", "100%"]
  );

  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  );

  return (
    <motion.div
      className="sticky top-0 h-screen w-full"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage:
          "url(https://images.unsplash.com/photo-1520975922071-9e0ce82759b0)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
    </motion.div>
  );
};

/* ================= PARALLAX IMAGES ================= */

const ParallaxImages = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px]">
      <ParallaxImg
        src="https://images.unsplash.com/photo-1521334884684-d80222895322"
        start={-200}
        end={200}
        className="w-1/3"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c"
        start={200}
        end={-250}
        className="mx-auto w-2/3"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1503455637927-730bce8583c0"
        start={-200}
        end={200}
        className="ml-auto w-1/3"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1494022299300-899b96e49893"
        start={0}
        end={-500}
        className="ml-24 w-5/12"
      />
    </div>
  );
};

/* ================= PARALLAX IMAGE ================= */

interface ParallaxImgProps {
  src: string;
  start: number;
  end: number;
  className?: string;
}

const ParallaxImg = ({
  src,
  start,
  end,
  className,
}: ParallaxImgProps) => {
  const ref = useRef<HTMLImageElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);
  const y = useTransform(scrollYProgress, [0, 1], [start, end]);

  const transform = useMotionTemplate`
    translateY(${y}px) scale(${scale})
  `;

  return (
    <motion.img
      ref={ref}
      src={src}
      className={className}
      style={{ transform, opacity }}
      alt=""
    />
  );
};

/* ================= PRODUCT LIST ================= */

const ProductList = () => {
  return (
    <section className="mx-auto max-w-5xl px-4 py-48 text-white">
      <motion.h1
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="mb-20 text-4xl font-light uppercase"
      >
        Featured Products
      </motion.h1>

      <ProductItem title="Men’s Essential Jacket" price="₹3,999" />
      <ProductItem title="Women’s Signature Dress" price="₹4,499" />
      <ProductItem title="Kids Comfort Hoodie" price="₹2,499" />
    </section>
  );
};

interface ProductItemProps {
  title: string;
  price: string;
}

const ProductItem = ({ title, price }: ProductItemProps) => {
  return (
    <motion.div
      initial={{ y: 48, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
      className="mb-9 flex items-center justify-between border-b border-zinc-800 px-3 pb-9"
    >
      <div>
        <p className="mb-1.5 text-xl text-zinc-50">{title}</p>
        <p className="text-sm uppercase text-zinc-500">{price}</p>
      </div>
      <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition">
        View <ArrowRight />
      </button>
    </motion.div>
  );
};
