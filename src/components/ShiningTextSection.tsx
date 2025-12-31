const ShiningTextSection = () => {
  return (
    <section className="flex h-48 items-center justify-center bg-black">
      <p
        className="
          relative overflow-hidden
          bg-[linear-gradient(90deg,#000,#fff,#000)]
          bg-[length:80%]
          bg-no-repeat
          bg-clip-text text-transparent
          font-sans uppercase
          tracking-[4px]
          text-[100px] sm:text-[100px]
          animate-[shine_3s_linear_infinite]
        "
      >
        SNEXA
        
      </p>

      {/* Inline keyframes */}
      <style>{`
        @keyframes shine {
          0% {
            background-position: -500%;
          }
          100% {
            background-position: 500%;
          }
        }
      `}</style>
    </section>
  );
};

export default ShiningTextSection;
