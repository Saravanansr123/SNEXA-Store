import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

type Customer = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  createdAt?: Timestamp;
};

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));

        const data: Customer[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Customer, "id">),
        }));

        setCustomers(data);
      } catch (error) {
        console.error("Failed to load customers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  if (loading) {
    return <p className="text-white/60">Loading customers...</p>;
  }

  if (!customers.length) {
    return (
      <p className="text-center text-white/40 mt-10">
        No customers found
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Customers</h1>

      <div className="bg-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/10 text-white/60">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Joined</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <td className="px-4 py-3">
                  {customer.name ?? "—"}
                </td>

                <td className="px-4 py-3 text-white/60">
                  {customer.email ?? "—"}
                </td>

                <td className="px-4 py-3">
                  {customer.phone ?? "—"}
                </td>

                <td className="px-4 py-3 text-white/60">
                  {customer.createdAt
                    ? customer.createdAt.toDate().toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
