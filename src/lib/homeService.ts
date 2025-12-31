import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const getHomeContent = async (mode: "draft" | "published") => {
  const ref = doc(db, "home_content", mode);
  const snap = await getDoc(ref);
  return snap.data();
};

export const saveDraft = async (data: any) => {
  await setDoc(doc(db, "home_content", "draft"), data);
};

export const publishHome = async () => {
  const draft = await getHomeContent("draft");
  await setDoc(doc(db, "home_content", "published"), draft);
};
