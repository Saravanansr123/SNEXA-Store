import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const snap = await getDocs(collection(db, "products"));
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };

    loadProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Products</h1>

      <div className="grid grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white/5 p-4 rounded-lg">
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
