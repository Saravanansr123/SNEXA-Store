import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  selected_size: string;
  selected_color: string;
  product?: {
    id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  addToCart: (productId: string, size: string, color: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const refreshCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    const q = query(collection(db, 'cart_items'), where('user_id', '==', user.uid));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as CartItem[];
    setCartItems(items);
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const addToCart = async (productId: string, size: string, color: string, quantity = 1) => {
    if (!user) return;
    // Check if item already exists
    const q = query(collection(db, 'cart_items'),
      where('user_id', '==', user.uid),
      where('product_id', '==', productId),
      where('selected_size', '==', size),
      where('selected_color', '==', color)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      // Update existing item
      const itemDoc = snapshot.docs[0];
      await updateDoc(doc(db, 'cart_items', itemDoc.id), {
        quantity: (itemDoc.data().quantity || 0) + quantity,
        updated_at: new Date().toISOString(),
      });
    } else {
      // Add new item
      await addDoc(collection(db, 'cart_items'), {
        user_id: user.uid,
        product_id: productId,
        selected_size: size,
        selected_color: color,
        quantity,
        updated_at: new Date().toISOString(),
      });
    }
    await refreshCart();
  };

  const removeFromCart = async (itemId: string) => {
    await deleteDoc(doc(db, 'cart_items', itemId));
    await refreshCart();
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }
    await updateDoc(doc(db, 'cart_items', itemId), {
      quantity,
      updated_at: new Date().toISOString(),
    });
    await refreshCart();
  };

  const clearCart = async () => {
    if (!user) return;
    const q = query(collection(db, 'cart_items'), where('user_id', '==', user.uid));
    const snapshot = await getDocs(q);
    for (const d of snapshot.docs) {
      await deleteDoc(doc(db, 'cart_items', d.id));
    }
    await refreshCart();
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        toggleCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
