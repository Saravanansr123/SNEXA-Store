import { db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function AddAdmin() {
  const auth = getAuth();

  const addAdmin = async () => {
    const email = prompt("Admin email");
    const password = prompt("Temp password");
    const name = prompt("Admin name");

    if (!email || !password || !name) return;

    const cred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setDoc(doc(db, "admins", cred.user.uid), {
      name,
      email,
      role: "ADMIN",
      createdAt: new Date(),
    });

    alert("Admin added");
  };

  return (
    <button
      onClick={addAdmin}
      className="bg-emerald-400 text-black px-6 py-3 rounded-xl"
    >
      Add Admin
    </button>
  );
}
