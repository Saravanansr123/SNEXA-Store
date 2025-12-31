import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

const products = [
  {
    id: "img4",
    title: "STORMTROOPER HELMET",
    price: "1299.99",
    bg: "https://res.cloudinary.com/muhammederdem/image/upload/q_60/v1536405223/starwars/item-4-bg.webp",
    img: "https://res.cloudinary.com/muhammederdem/image/upload/q_60/v1536405215/starwars/item-4.webp",
    durability: 80,
  },
];

export default function StarWarsProductSlider() {
  const [active, setActive] = useState(0);
  const [size, setSize] = useState("XL");

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black px-6 overflow-hidden">

      {/* FLOATING PRODUCT IMAGE */}
      <div className="hidden lg:block absolute left-[8%] z-30">
        <img
          src={products[active].img}
          className="w-[420px] drop-shadow-2xl"
          alt=""
        />
      </div>

      {/* SLIDER CARD */}
      <div className="relative w-full max-w-6xl rounded-[2.5rem] overflow-hidden">

        {/* RIGHT ARROW */}
        <button className="absolute z-30 right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white flex items-center justify-center">
          →
        </button>

        <Swiper
          modules={[Navigation, EffectFade]}
          effect="fade"
          slidesPerView={1}
          onSlideChange={(s) => setActive(s.activeIndex)}
        >
          {products.map((p) => (
            <SwiperSlide key={p.id}>
              <div
                className="relative min-h-[520px] bg-cover bg-center flex items-center"
                style={{ backgroundImage: `url(${p.bg})` }}
              >
                <div className="absolute inset-0 bg-black/70" />

                {/* CONTENT */}
                <div className="relative z-20 text-white w-full pl-10 pr-20 lg:pl-[420px]">

                  <h2 className="text-4xl font-extrabold tracking-widest mb-2">
                    {p.title}
                  </h2>

                  <p className="text-3xl mb-8">
                    ${p.price.split(".")[0]}
                    <sup className="text-lg">.{p.price.split(".")[1]}</sup>
                  </p>

                  {/* SIZE */}
                  <div className="mb-10">
                    <p className="text-sm tracking-widest mb-3 text-gray-300">
                      HELMET SIZE
                    </p>
                    <div className="flex gap-4">
                      {["S", "M", "L", "XL"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={`w-10 h-10 rounded-full border text-sm ${
                            size === s
                              ? "border-red-500 text-white"
                              : "border-gray-500 text-gray-400"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* DURABILITY */}
                  <div className="flex items-center gap-6 mb-10">
                    <div className="relative w-24 h-24">
                      <svg viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="44"
                          stroke="#cb2240"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${p.durability * 2.8},300`}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center font-bold text-lg">
                        {p.durability}%
                      </span>
                    </div>
                    <span className="tracking-widest text-sm text-gray-300">
                      DURABILITY RATE
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-8">
                    <button className="bg-red-600 hover:bg-red-500 px-10 py-4 rounded-full text-sm tracking-widest">
                      ADD TO CART
                    </button>

                    <button className="flex items-center gap-2 text-gray-400 hover:text-white">
                      ♥ ADD TO WISHLIST
                    </button>
                  </div>

                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
