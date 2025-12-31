import React from "react";

const MarqueeText = () => {
  return (
    <section className="relative flex w-full h-screen items-center justify-center overflow-hidden bg-gray-200">
      {/* First marquee */}
      <div className="absolute w-full flex animate-marqueeOne whitespace-nowrap">
        {["SNEXA", "SNEXA", "SNEXA", "SNEXA"].map((text, idx) => (
          <span
            key={idx}
            className="text-[10vw] px-[2vw] uppercase text-transparent stroke-black"
          >
            {text}
          </span>
        ))}
      </div>

      {/* Second marquee */}
      <div className="absolute w-full flex animate-marqueeTwo whitespace-nowrap top-12">
        {["SNEXA", "SNEXA", "SNEXA", "SNEXA"].map(
          (text, idx) => (
            <span
              key={idx}
              className="text-[10vw] px-[2vw] uppercase text-transparent stroke-black"
            >
              {text}
            </span>
          )
        )}
      </div>

      {/* Inline styles for keyframes & text stroke */}
      <style>{`
        .stroke-black {
          -webkit-text-stroke: 2px black;
          -webkit-text-fill-color: transparent;
        }
        @media (min-width: 1024px) {
          .stroke-black {
            -webkit-text-stroke: 3px black;
          }
        }
        @keyframes marqueeOne {
          0% { transform: translate3d(20%, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes marqueeTwo {
          0% { transform: translate3d(-100%, 0, 0); }
          100% { transform: translate3d(20%, 0, 0); }
        }
        .animate-marqueeOne {
          animation: marqueeOne 10s linear infinite;
        }
        .animate-marqueeTwo {
          animation: marqueeTwo 10s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default MarqueeText;
