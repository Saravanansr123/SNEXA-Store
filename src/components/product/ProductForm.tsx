import { useEffect, useState } from "react";

/* ---------- STYLES ---------- */

const field =
  "w-full rounded-xl bg-[#2e2e2e] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400/60";

const section =
  "rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4";

/* ---------- SIZES ---------- */

const SIZE_MAP: Record<string, string[]> = {
  Men: ["S", "M", "L", "XL", "XXL"],
  Women: ["XS", "S", "M", "L", "XL", "XXL"],
  Kids: [
    "0-3 months",
    "3-6 months",
    "6-8 months",
    "8-10 months",
    "10-12 months",
    "2-4 yrs",
    "4-6 yrs",
    "6-8 yrs",
    "8-10 yrs",
  ],
};

/* ---------- COMPONENT ---------- */

export default function ProductForm({
  initialProduct,
  onSubmit,
  onCancel,
  mode, // "add" | "edit"
  loading,
}: any) {
  const [product, setProduct] = useState<any>(initialProduct);
  const [colorImages, setColorImages] = useState(false);

  // temp file storage (NOT firestore)
  const [newDefaultImages, setNewDefaultImages] = useState<File[]>([]);
  const [variantFiles, setVariantFiles] = useState<Record<number, File[]>>({});

  /* ---------- COLLECTION CHANGE ---------- */

  useEffect(() => {
    const sizes = SIZE_MAP[product.collection] || [];
    setProduct((p: any) => ({
      ...p,
      variants: (p.variants || []).map((v: any) => ({
        ...v,
        sizes: sizes.map(s => ({ size: s, stock: 0 })),
      })),
    }));
  }, [product.collection]);

  /* ---------- HELPERS ---------- */

  const addVariant = () => {
    const sizes = SIZE_MAP[product.collection] || [];
    setProduct({
      ...product,
      variants: [
        ...(product.variants || []),
        {
          color: "",
          hex: "#000000",
          sizes: sizes.map(s => ({ size: s, stock: 0 })),
          images: [],
          thumbnailIndex: 0,
        },
      ],
    });
  };

  /* ---------- SUBMIT ---------- */

  const handleSubmit = () => {
    onSubmit({
      product,
      newDefaultImages,
      variantFiles,
      colorImages,
    });
  };

  /* ---------- UI ---------- */

  return (
    <div className="space-y-8">

      {/* BASIC */}
      <div className={section}>
        <input
          className={field}
          placeholder="Product name"
          value={product.name}
          onChange={e =>
            setProduct({ ...product, name: e.target.value })
          }
        />

        <textarea
          rows={3}
          className={field}
          placeholder="Description"
          value={product.description}
          onChange={e =>
            setProduct({ ...product, description: e.target.value })
          }
        />
      </div>

      {/* COLLECTION */}
      <div className={section}>
        <select
          className={field}
          value={product.collection}
          onChange={e =>
            setProduct({ ...product, collection: e.target.value })
          }
        >
          <option value="">Select collection</option>
          <option>Men</option>
          <option>Women</option>
          <option>Kids</option>
        </select>

        <input
          className={field}
          placeholder="Sub collection"
          value={product.subCollection}
          onChange={e =>
            setProduct({ ...product, subCollection: e.target.value })
          }
        />
      </div>

      {/* IMAGES */}
      <div className={section}>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={colorImages}
            onChange={e => setColorImages(e.target.checked)}
          />
          Images per colour
        </label>

        {!colorImages && (
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={e =>
              setNewDefaultImages(
                Array.from(e.target.files || []).slice(0, 5)
              )
            }
          />
        )}
      </div>

      {/* VARIANTS */}
      <div className={section}>
        <div className="flex justify-between">
          <h3>Colour Variants</h3>
          <button onClick={addVariant} className="text-sky-400">
            + Add Colour
          </button>
        </div>

        {product.variants?.map((v: any, vi: number) => (
          <div key={vi} className="border-t border-white/10 pt-4 space-y-4">
            <div className="flex gap-3">
              <input
                className={field}
                placeholder="Colour name"
                value={v.color}
                onChange={e => {
                  const vars = [...product.variants];
                  vars[vi].color = e.target.value;
                  setProduct({ ...product, variants: vars });
                }}
              />
              <input
                type="color"
                value={v.hex}
                onChange={e => {
                  const vars = [...product.variants];
                  vars[vi].hex = e.target.value;
                  setProduct({ ...product, variants: vars });
                }}
              />
            </div>

            {colorImages && (
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={e =>
                  setVariantFiles({
                    ...variantFiles,
                    [vi]: Array.from(e.target.files || []).slice(0, 5),
                  })
                }
              />
            )}
          </div>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-4 pt-6">
        <button
          onClick={onCancel}
          className="rounded-xl bg-white/10 px-6 py-3"
        >
          Cancel
        </button>

        <button
          disabled={loading}
          onClick={handleSubmit}
          className="rounded-xl bg-sky-400 px-8 py-3 font-medium text-black"
        >
          {mode === "add" ? "Add Product" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
