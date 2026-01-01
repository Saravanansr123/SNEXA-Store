import { useEffect, useState } from "react";
import {
  getAllProducts,
  deleteProduct,
  addProduct,
  updateProduct,
} from "../../lib/productService";
import GlassModal from "../../components/ui/GlassModal";
import ProductForm from "../../components/product/ProductForm";

/* ================= EMPTY PRODUCT ================= */

const emptyProduct = {
  name: "",
  description: "",
  collection: "",
  subCollection: "",
  images: [],
  variants: [],
  mrp: 0,
  salePrice: 0,
  discount: 0,
  status: "active",
};

/* ================= COMPONENT ================= */

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD ================= */

  const load = async () => {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  /* ================= SAVE HANDLER ================= */

  const handleSubmit = async ({
  product,
  newDefaultImages,
  variantFiles,
  colorImages,
}: {
  product: any;
  newDefaultImages: File[];
  variantFiles: Record<number, File[]>;
  colorImages: boolean;
}) => {
  setSaving(true);

  try {
    if (editingProduct?.id) {
      await updateProduct(
        editingProduct.id,
        {
          ...product,
          thumbnailIndex: product.thumbnailIndex ?? 0,
        },
        newDefaultImages,
        editingProduct.images || [],
        variantFiles,
        colorImages
      );
    } else {
      await addProduct(
        {
          ...product,
          thumbnailIndex: product.thumbnailIndex ?? 0,
        },
        newDefaultImages,
        variantFiles,
        colorImages
      );
    }

    await load();
    setModalOpen(false);
    setEditingProduct(null);
  } finally {
    setSaving(false);
  }
};


  /* ================= UI ================= */

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">Products</h1>

        <button
          onClick={() => {
            setEditingProduct(null);
            setModalOpen(true);
          }}
          className="px-4 py-2 rounded-lg bg-emerald-400 text-black"
        >
          + Add Product
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-white/60">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white/10 rounded-xl p-4">
              <img
                src={p.images?.[p.thumbnailIndex || 0]}
                className="h-40 w-full object-cover rounded mb-2"
              />

              <h3 className="text-white">{p.name}</h3>
              <p className="text-white/60">₹{p.salePrice}</p>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => {
                    setEditingProduct(p);
                    setModalOpen(true);
                  }}
                  className="text-blue-400 text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={async () => {
                    if (confirm("Delete product?")) {
                      await deleteProduct(p.id, p.images || []);
                      load();
                    }
                  }}
                  className="text-red-400 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {modalOpen && (
        <GlassModal
          title={editingProduct ? "Edit Product" : "Add Product"}
          onClose={() => {
            setModalOpen(false);
            setEditingProduct(null);
          }}
        >
          <ProductForm
            initialProduct={editingProduct || emptyProduct}
            mode={editingProduct ? "edit" : "add"}
            loading={saving}
            onCancel={() => {
              setModalOpen(false);
              setEditingProduct(null);
            }}
            onSubmit={handleSubmit}
          />
        </GlassModal>
      )}
    </div>
  );
}
