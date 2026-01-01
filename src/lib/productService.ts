import {
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  collection,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "./firebase";

/* ================= GET ALL PRODUCTS ================= */

export const getAllProducts = async () => {
  const snap = await getDocs(collection(db, "products"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

/* ================= ADD PRODUCT ================= */

export const addProduct = async (
  product: any,
  defaultImages: File[],
  variantFiles: Record<number, File[]>,
  colorImages: boolean
) => {
  const refDoc = await addDoc(collection(db, "products"), {
    ...product,
    images: [],
    variants: product.variants || [],
    createdAt: serverTimestamp(),
  });

  const productId = refDoc.id;

  let uploadedCommon: string[] = [];

  if (!colorImages && defaultImages.length) {
    for (const file of defaultImages.slice(0, 5)) {
      const imgRef = ref(storage, `products/${productId}/${file.name}`);
      await uploadBytes(imgRef, file);
      uploadedCommon.push(await getDownloadURL(imgRef));
    }
  }

  const updatedVariants = [...(product.variants || [])];

  if (colorImages) {
    for (const index in variantFiles) {
      const urls: string[] = [];
      for (const file of variantFiles[index].slice(0, 5)) {
        const imgRef = ref(
          storage,
          `products/${productId}/variants/${index}/${file.name}`
        );
        await uploadBytes(imgRef, file);
        urls.push(await getDownloadURL(imgRef));
      }
      updatedVariants[index].images = urls;
    }
  }

  await updateDoc(doc(db, "products", productId), {
    images: uploadedCommon,
    variants: updatedVariants,
  });
};



/* ================= UPDATE PRODUCT ================= */

export const updateProduct = async (
  id: string,
  product: any,
  newDefaultImages: File[],
  existingImages: string[],
  variantFiles: Record<number, File[]>,
  colorImages: boolean
) => {
  let finalImages = existingImages;

  if (!colorImages && newDefaultImages.length) {
    finalImages = [];
    for (const file of newDefaultImages.slice(0, 5)) {
      const imgRef = ref(storage, `products/${id}/${file.name}`);
      await uploadBytes(imgRef, file);
      finalImages.push(await getDownloadURL(imgRef));
    }
  }

  const updatedVariants = [...(product.variants || [])];

  if (colorImages) {
    for (const index in variantFiles) {
      const urls: string[] = [];
      for (const file of variantFiles[index].slice(0, 5)) {
        const imgRef = ref(
          storage,
          `products/${id}/variants/${index}/${file.name}`
        );
        await uploadBytes(imgRef, file);
        urls.push(await getDownloadURL(imgRef));
      }
      updatedVariants[index].images = urls;
    }
  }

  await updateDoc(doc(db, "products", id), {
    ...product,
    images: finalImages,
    variants: updatedVariants,
    updatedAt: serverTimestamp(),
  });
};

/* ================= DELETE PRODUCT ================= */

export const deleteProduct = async (id: string, images: string[]) => {
  for (const url of images || []) {
    try {
      await deleteObject(ref(storage, url));
    } catch {
      /* ignore */
    }
  }

  await deleteDoc(doc(db, "products", id));
};
