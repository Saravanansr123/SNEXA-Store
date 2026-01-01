export default function VariantManager({ variants, setVariants }: any) {
  const addVariant = () =>
    setVariants([...variants, { color: "", hex: "#000000", sizes: [] }]);

  return (
    <div className="space-y-4">
      {variants.map((v: any, i: number) => (
        <div key={i} className="bg-white/5 p-4 rounded-xl">
          <input placeholder="Color" onChange={e => (v.color = e.target.value)} />
          <input type="color" onChange={e => (v.hex = e.target.value)} />

          {["S", "M", "L", "XL"].map(size => (
            <div key={size} className="flex gap-2">
              <span>{size}</span>
              <input
                type="number"
                placeholder="Stock"
                onChange={e =>
                  v.sizes.push({ size, stock: Number(e.target.value) })
                }
              />
            </div>
          ))}
        </div>
      ))}
      <button onClick={addVariant}>+ Add Colour</button>
    </div>
  );
}
