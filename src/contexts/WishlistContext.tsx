import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

interface WishlistItem {
  id: string;
  product_id: string;
  created_at: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistProductIds: Set<string>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistProductIds, setWishlistProductIds] = useState<Set<string>>(new Set());

  const refreshWishlist = async () => {
    if (!user) {
      setWishlistItems([]);
      setWishlistProductIds(new Set());
      return;
    }
    const q = query(collection(db, 'wishlist_items'), where('user_id', '==', user.uid));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WishlistItem[];
    setWishlistItems(items);
    setWishlistProductIds(new Set(items.map(item => item.product_id)));
  };

  useEffect(() => {
    refreshWishlist();
  }, [user]);

  const addToWishlist = async (productId: string) => {
    if (!user) return;
    await addDoc(collection(db, 'wishlist_items'), {
      user_id: user.uid,
      product_id: productId,
      created_at: new Date().toISOString(),
    });
    await refreshWishlist();
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    // Find the wishlist item document for this user and product
    const q = query(collection(db, 'wishlist_items'), where('user_id', '==', user.uid), where('product_id', '==', productId));
    const snapshot = await getDocs(q);
    for (const d of snapshot.docs) {
      await deleteDoc(doc(db, 'wishlist_items', d.id));
    }
    await refreshWishlist();
  };

  const isInWishlist = (productId: string) => {
    return wishlistProductIds.has(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistProductIds,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
