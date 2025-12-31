import React, { useMemo } from "react";

type Position = "top" | "bottom" | "left" | "right";

interface GradualBlurProps {
  position?: Position;
  height?: string; // ex: "6rem", "120px"
  strength?: number;
  layers?: number;
  opacity?: number;
  className?: string;
}

const CURVES = {
  linear: (p: number) => p,
  smooth: (p: number) => p * p * (3 - 2 * p),
};

const GradualBlur: React.FC<GradualBlurProps> = ({
  position = "bottom",
  height = "6rem",
  strength = 2,
  layers = 6,
  opacity = 1,
  className = "",
}) => {
  const direction = {
    top: "to top",
    bottom: "to bottom",
    left: "to left",
    right: "to right",
  }[position];

  const blurLayers = useMemo(() => {
    return Array.from({ length: layers }).map((_, i) => {
      const p = CURVES.smooth((i + 1) / layers);
      const blur = (p * strength).toFixed(2);

      const start = (i / layers) * 100;
      const end = ((i + 1) / layers) * 100;

      return (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${blur}rem)`,
            WebkitBackdropFilter: `blur(${blur}rem)`,
            maskImage: `linear-gradient(${direction}, transparent ${start}%, black ${end}%)`,
            WebkitMaskImage: `linear-gradient(${direction}, transparent ${start}%, black ${end}%)`,
            opacity,
          }}
        />
      );
    });
  }, [layers, strength, direction, opacity]);

  const sizeStyle =
    position === "top" || position === "bottom"
      ? { height, width: "100%" }
      : { width: height, height: "100%" };

  return (
    <div
      className={`pointer-events-none absolute z-50 ${className}`}
      style={{
        ...sizeStyle,
        [position]: 0,
        left: position === "top" || position === "bottom" ? 0 : undefined,
        top: position === "left" || position === "right" ? 0 : undefined,
      }}
    >
      <div className="relative w-full h-full isolate">
        {blurLayers}
      </div>
    </div>
  );
};

export default React.memo(GradualBlur);
