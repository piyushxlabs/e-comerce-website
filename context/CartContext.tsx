'use client';

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
} from 'react';
import type {
  CartState,
  CartAction,
  CartItem,
  Product,
  PriceBreakdown,
} from '@/types/product';

// ─── Constants ────────────────────────────────────────────────────────────────
const VALID_COUPON = 'NST2026';
const COUPON_RATE = 0.20;
const TAX_RATE = 0.085;
const LS_KEY = 'nexus-cart-v1';

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialState: CartState = {
  items: [],
  isDrawerOpen: false,
  couponCode: '',
  isCouponApplied: false,
  couponDiscountRate: 0,
};

// ─── Reducer ───────────────────────────────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.product.id === action.payload.id
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.payload, quantity: 1 }],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.product.id !== action.payload),
      };

    case 'INCREMENT_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.payload
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      };

    case 'DECREMENT_QTY': {
      const updated = state.items
        .map((i) =>
          i.product.id === action.payload
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0);
      return { ...state, items: updated };
    }

    case 'APPLY_COUPON': {
      const isValid = action.payload.trim().toUpperCase() === VALID_COUPON;
      return {
        ...state,
        couponCode: action.payload,
        isCouponApplied: isValid,
        couponDiscountRate: isValid ? COUPON_RATE : 0,
      };
    }

    case 'REMOVE_COUPON':
      return {
        ...state,
        couponCode: '',
        isCouponApplied: false,
        couponDiscountRate: 0,
      };

    case 'TOGGLE_DRAWER':
      return { ...state, isDrawerOpen: !state.isDrawerOpen };

    case 'OPEN_DRAWER':
      return { ...state, isDrawerOpen: true };

    case 'CLOSE_DRAWER':
      return { ...state, isDrawerOpen: false };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        couponCode: '',
        isCouponApplied: false,
        couponDiscountRate: 0,
      };

    default:
      return state;
  }
}

// ─── Context Shape ─────────────────────────────────────────────────────────────
interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  priceBreakdown: PriceBreakdown;
  totalItemCount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  incrementQty: (productId: string) => void;
  decrementQty: (productId: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────────────────────────
interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage (SSR-safe: runs only on client)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          items?: CartItem[];
          couponCode?: string;
          isCouponApplied?: boolean;
        };
        if (parsed.items && Array.isArray(parsed.items)) {
          parsed.items.forEach((item: CartItem) => {
            dispatch({ type: 'ADD_ITEM', payload: item.product });
            // Add additional quantities beyond the first
            for (let q = 1; q < item.quantity; q++) {
              dispatch({ type: 'INCREMENT_QTY', payload: item.product.id });
            }
          });
        }
        if (parsed.isCouponApplied && parsed.couponCode) {
          dispatch({ type: 'APPLY_COUPON', payload: parsed.couponCode });
        }
      }
    } catch {
      // silently ignore localStorage parse errors
    } finally {
      setIsHydrated(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to localStorage on state changes (after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          items: state.items,
          couponCode: state.couponCode,
          isCouponApplied: state.isCouponApplied,
          couponDiscountRate: state.couponDiscountRate,
        })
      );
    } catch {
      // silently ignore
    }
  }, [
    state.items,
    state.couponCode,
    state.isCouponApplied,
    state.couponDiscountRate,
    isHydrated,
  ]);

  // ─── Memoized: Price Breakdown ─────────────────────────────────────────────
  const priceBreakdown = useMemo((): PriceBreakdown => {
    const subtotal =
      Math.round(
        state.items.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        ) * 100
      ) / 100;

    const couponDiscount =
      Math.round(subtotal * state.couponDiscountRate * 100) / 100;

    const taxableAmount =
      Math.round((subtotal - couponDiscount) * 100) / 100;

    const estimatedTax =
      Math.round(taxableAmount * TAX_RATE * 100) / 100;

    const total =
      Math.round((taxableAmount + estimatedTax) * 100) / 100;

    return { subtotal, couponDiscount, taxableAmount, estimatedTax, total };
  }, [state.items, state.couponDiscountRate]);

  // ─── Memoized: Total Count ────────────────────────────────────────────────
  const totalItemCount = useMemo(
    () => state.items.reduce((acc, item) => acc + item.quantity, 0),
    [state.items]
  );

  // ─── Stable Action Helpers ─────────────────────────────────────────────────
  const addToCart = useCallback(
    (product: Product) => dispatch({ type: 'ADD_ITEM', payload: product }),
    []
  );
  const removeFromCart = useCallback(
    (productId: string) =>
      dispatch({ type: 'REMOVE_ITEM', payload: productId }),
    []
  );
  const incrementQty = useCallback(
    (productId: string) =>
      dispatch({ type: 'INCREMENT_QTY', payload: productId }),
    []
  );
  const decrementQty = useCallback(
    (productId: string) =>
      dispatch({ type: 'DECREMENT_QTY', payload: productId }),
    []
  );
  const applyCoupon = useCallback((code: string): boolean => {
    const isValid = code.trim().toUpperCase() === VALID_COUPON;
    dispatch({ type: 'APPLY_COUPON', payload: code });
    return isValid;
  }, []);
  const removeCoupon = useCallback(
    () => dispatch({ type: 'REMOVE_COUPON' }),
    []
  );
  const toggleDrawer = useCallback(
    () => dispatch({ type: 'TOGGLE_DRAWER' }),
    []
  );
  const openDrawer = useCallback(
    () => dispatch({ type: 'OPEN_DRAWER' }),
    []
  );
  const closeDrawer = useCallback(
    () => dispatch({ type: 'CLOSE_DRAWER' }),
    []
  );
  const clearCart = useCallback(
    () => dispatch({ type: 'CLEAR_CART' }),
    []
  );

  const value = useMemo<CartContextValue>(
    () => ({
      state,
      dispatch,
      priceBreakdown,
      totalItemCount,
      addToCart,
      removeFromCart,
      incrementQty,
      decrementQty,
      applyCoupon,
      removeCoupon,
      toggleDrawer,
      openDrawer,
      closeDrawer,
      clearCart,
    }),
    [
      state,
      priceBreakdown,
      totalItemCount,
      addToCart,
      removeFromCart,
      incrementQty,
      decrementQty,
      applyCoupon,
      removeCoupon,
      toggleDrawer,
      openDrawer,
      closeDrawer,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
