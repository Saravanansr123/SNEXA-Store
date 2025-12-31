import { useEffect, useRef } from "react";

const MorphingText = () => {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const texts = ["Why", "for", "this", "so", "satisfying", "to", "watch?"];

  const morphTime = 1;
  const cooldownTime = 0.25;

  let textIndex = texts.length - 1;
  let time = new Date();
  let morph = 0;
  let cooldown = cooldownTime;

  useEffect(() => {
    const elts = {
      text1: text1Ref.current!,
      text2: text2Ref.current!,
    };

    elts.text1.textContent = texts[textIndex % texts.length];
    elts.text2.textContent = texts[(textIndex + 1) % texts.length];

    function setMorph(fraction: number) {
      elts.text2.style.filter = `blur(${Math.min(
        8 / fraction - 8,
        100
      )}px)`;
      elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      fraction = 1 - fraction;

      elts.text1.style.filter = `blur(${Math.min(
        8 / fraction - 8,
        100
      )}px)`;
      elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      elts.text1.textContent = texts[textIndex % texts.length];
      elts.text2.textContent = texts[(textIndex + 1) % texts.length];
    }

    function doMorph() {
      morph -= cooldown;
      cooldown = 0;

      let fraction = morph / morphTime;

      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }

      setMorph(fraction);
    }

    function doCooldown() {
      morph = 0;
      elts.text2.style.filter = "";
      elts.text2.style.opacity = "100%";
      elts.text1.style.filter = "";
      elts.text1.style.opacity = "0%";
    }

    function animate() {
      requestAnimationFrame(animate);

      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex++;
        }
        doMorph();
      } else {
        doCooldown();
      }
    }

    animate();
  }, []);

  return (
    <section className="relative flex h-40 items-center justify-center bg-black overflow-hidden">
      {/* Text Container */}
      <div
        className="absolute w-full text-center"
        style={{
          filter: "url(#threshold) blur(0.6px)",
        }}
      >
        <span
          ref={text1Ref}
          className="absolute left-0 right-0 select-none font-extrabold text-white text-3xl sm:text-5xl md:text-6xl"
          style={{ fontFamily: "Raleway, sans-serif" }}
        />
        <span
          ref={text2Ref}
          className="absolute left-0 right-0 select-none font-extrabold text-white text-3xl sm:text-5xl md:text-6xl"
          style={{ fontFamily: "Raleway, sans-serif" }}
        />
      </div>

      {/* SVG Filter */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 255 -140
              "
            />
          </filter>
        </defs>
      </svg>
    </section>
  );
};

export default MorphingText;
