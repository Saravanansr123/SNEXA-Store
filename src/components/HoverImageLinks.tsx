import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

/* ================= TYPES ================= */

interface HoverImageLinksProps {
  onItemClick?: (route?: string) => void;
}

interface LinkItemProps {
  heading: string;
  subheading: string;
  imgSrc: string;
  route?: string;
}

/* ================= DATA ================= */

const LINKS: LinkItemProps[] = [
  {
    heading: "Mens",
    subheading: "Premium menswear collection",
    imgSrc: "/src/images/Men1.jpg",
    route: "mens",
  },
  {
    heading: "Womens",
    subheading: "Elegant styles for women",
    imgSrc: "/src/images/women1.jpg",
    route: "womens",
  },
  {
    heading: "Kids",
    subheading: "Comfort wear for kids",
    imgSrc: "/src/images/Kid1.jpg",
    route: "kids",
  },
  {
    heading: "Contact Us",
    subheading: "Get in touch with us",
    imgSrc: "/imgs/random/5.jpg",
    route: "contact",
  },
];

/* ================= COMPONENT ================= */

export const HoverImageLinks = ({
  onItemClick,
}: HoverImageLinksProps) => {
  return (
    <section className="bg-neutral-950 px-6 md:px-8 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        {LINKS.map((item) => (
          <HoverLink
            key={item.heading}
            {...item}
            onClick={onItemClick}
          />
        ))}
      </div>
    </section>
  );
};

/* ================= LINK ================= */

interface HoverLinkProps extends LinkItemProps {
  onClick?: (route?: string) => void;
}

const HoverLink = ({
  heading,
  subheading,
  imgSrc,
  route,
  onClick,
}: HoverLinkProps) => {
  const ref = useRef<HTMLButtonElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 120, damping: 20 });
  const ySpring = useSpring(y, { stiffness: 120, damping: 20 });

  const top = useTransform(ySpring, [-0.5, 0.5], ["60%", "40%"]);
  const left = useTransform(xSpring, [-0.5, 0.5], ["40%", "60%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || window.matchMedia("(pointer: coarse)").matches) return;

    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onMouseMove={handleMouseMove}
      onClick={() => onClick?.(route)}
      initial="rest"
      whileHover="hover"
      className="
        group relative w-full text-left
        flex items-center justify-between
        border-b border-white/10
        py-6 md:py-8
        focus:outline-none
      "
    >
      {/* TEXT */}
      <div className="relative z-10">
        <motion.h3
          variants={{
            rest: { x: 0 },
            hover: { x: -12 },
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="
            text-3xl md:text-6xl
            font-bold
            text-white/60
            group-hover:text-white
            transition-colors
          "
        >
          {heading}
        </motion.h3>

        <p className="mt-2 text-sm text-white/50 group-hover:text-white">
          {subheading}
        </p>
      </div>

      {/* HOVER IMAGE (DESKTOP ONLY) */}
      <motion.img
        src={imgSrc}
        alt={heading}
        style={{
          top,
          left,
          translateX: "-50%",
          translateY: "-50%",
        }}
        variants={{
          rest: { scale: 0, rotate: -12 },
          hover: { scale: 1, rotate: 12 },
        }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="
          absolute z-0
          h-40 w-64
          rounded-xl object-cover
          pointer-events-none
          hidden md:block
        "
      />
    </motion.button>
  );
};
