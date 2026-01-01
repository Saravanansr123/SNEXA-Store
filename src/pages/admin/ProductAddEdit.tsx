import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { addProduct, updateProduct } from "../../lib/productService";
import ProductForm from "../../components/product/ProductForm";

const defaultProduct = {
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

export default function ProductAddEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(defaultProduct);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const snap = await getDoc(doc(db, "products", id));
      if (snap.exists()) {
        setProduct({ id: snap.id, ...snap.data() });
      }
    };

    load();
  }, [id]);

  const handleSubmit = async (payload: {
    product: any;
    newDefaultImages: File[];
    variantFiles: Record<number, File[]>;
    colorImages: boolean;
  }) => {
    setLoading(true);

    const {
      product,
      newDefaultImages,
      variantFiles,
      colorImages,
    } = payload;

    if (id) {
      await updateProduct(
        id,
        product,
        newDefaultImages,
        product.images || [],
        variantFiles,
        colorImages
      );
    } else {
      await addProduct(
        product,
        newDefaultImages,
        variantFiles,
        colorImages
      );
    }

    setLoading(false);
    navigate("/admin/products");
  };

  return (
    <ProductForm
      initialProduct={product}
      mode={id ? "edit" : "add"}
      loading={loading}
      onCancel={() => navigate("/admin/products")}
      onSubmit={handleSubmit}
    />
  );
}
