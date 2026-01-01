import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const logAudit = async (action: string, payload: any) => {
  await addDoc(collection(db, "auditLogs"), {
    action,
    payload,
    at: serverTimestamp(),
  });
};
