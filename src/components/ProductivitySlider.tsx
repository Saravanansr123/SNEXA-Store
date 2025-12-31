import { useEffect, useRef, useState } from "react";

interface Slide {
  title: string;
  desc: string;
  bg: string;
  thumb: string;
  category: string;
}

const slides: Slide[] = [
  {
    title: "Mens",
    desc: "Tools that work like you do.",
    bg: "https://cdn-front.freepik.com/home/anon-rvmp/professionals/designers.webp",
    thumb:
      "https://cdn-front.freepik.com/home/anon-rvmp/professionals/img-designer.webp?w=480",
    category: "men",
  },
  {
    title: "Women",
    desc: "Create faster, explore new possibilities.",
    bg: "https://cdn-front.freepik.com/home/anon-rvmp/professionals/marketers.webp",
    thumb:
      "https://cdn-front.freepik.com/home/anon-rvmp/professionals/img-marketer.webp?w=480",
    category: "women",
  },
  {
    title: "Kids",
    desc: "From concept to cut, faster.",
    bg: "https://cdn-front.freepik.com/home/anon-rvmp/professionals/filmmakers.webp",
    thumb:
      "https://cdn-front.freepik.com/home/anon-rvmp/professionals/img-film.webp?w=480",
    category: "kids",
  },
];

interface ProductivitySliderProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function ProductivitySlider({ onNavigate }: ProductivitySliderProps) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.children[active] as HTMLElement;
    if (!card) return;

    const isMobile = window.innerWidth < 768;

    track.scrollTo({
      left: isMobile
        ? 0
        : card.offsetLeft - track.clientWidth / 2 + card.clientWidth / 2,
      top: isMobile ? card.offsetTop - 20 : 0,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <section className="bg-black text-white py-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-end">
        <h2 className="text-2xl md:text-4xl font-light max-w-xl">
          Collections Categories
        </h2>

        <div className="hidden md:flex gap-2">
          <button
            onClick={() => setActive((p) => Math.max(p - 1, 0))}
            disabled={active === 0}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-orange-500 disabled:opacity-30"
          >
            ‹
          </button>
          <button
            onClick={() => setActive((p) => Math.min(p + 1, slides.length - 1))}
            disabled={active === slides.length - 1}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-orange-500 disabled:opacity-30"
          >
            ›
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="max-w-7xl mx-auto mt-12 overflow-hidden px-6">
        <div ref={trackRef} className="flex md:flex-row flex-col gap-5">
          {slides.map((item, i) => {
            const isActive = active === i;

            return (
              <article
                key={i}
                onClick={() => setActive(i)}
                className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-500
                  ${
                    isActive
                      ? "md:basis-[30rem] md:-translate-y-2 shadow-2xl"
                      : "md:basis-[5rem]"
                  }
                  md:h-[26rem] min-h-[90px]`}
              >
                <img
                  src={item.bg}
                  className="absolute inset-0 w-full h-full object-cover brightness-75"
                  alt={item.title}
                />

                <div className="relative z-10 h-full w-full flex items-center justify-center bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  {!isActive ? (
                    <h3 className="md:[writing-mode:vertical-rl] md:rotate-180 font-bold text-lg">
                      {item.title}
                    </h3>
                  ) : (
                    <div className="flex gap-6 items-center px-6">
                      <img
                        src={item.thumb}
                        className="hidden md:block w-[130px] h-[270px] object-cover rounded-md shadow-lg"
                        alt={item.title}
                      />
                      <div>
                        <h3 className="text-3xl font-bold mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-300 mb-4 max-w-xs">
                          {item.desc}
                        </p>

                        {/* ✅ CUSTOM ROUTER NAVIGATION */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate("products", {
                              category: item.category,
                            });
                          }}
                          className="px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-400 text-sm font-semibold transition"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Dots */}
        <div className="hidden md:flex justify-center gap-3 mt-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-3 h-3 rounded-full transition ${
                active === i ? "bg-orange-500 scale-125" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
