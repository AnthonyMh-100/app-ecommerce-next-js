import { CartProduct } from "@/interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];
  getTotalItems: () => number;
  getSummaryInformation: (cart?: CartProduct[]) => {
    itemsInCart: number;
    subTotal: number;
    tax: number;
    total: number;
  };
  addProducToCart: (product: CartProduct) => void;
  updateProducQuantity: (product: CartProduct, quantity: number) => void;
  remove: (product: CartProduct) => void;

  clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      clearCart: () => {
        set({ cart: [] });
      },
      getTotalItems: () => {
        const { cart } = get();

        const totalItems = cart.reduce(
          (acc, { quantity }) => acc + quantity,
          0,
        );

        return totalItems;
      },
      getSummaryInformation: (cartProducts) => {
        const cart = cartProducts ?? get().cart;

        const subTotal = cart.reduce(
          (acc, product) => product.quantity * product.price + acc,
          0,
        );

        const tax = subTotal * 0.15;
        const total = subTotal + tax;

        const itemsInCart = cart.reduce(
          (acc, { quantity }) => acc + quantity,
          0,
        );

        return {
          itemsInCart,
          subTotal,
          tax,
          total,
        };
      },
      addProducToCart: (product: CartProduct) => {
        const { cart } = get();
        const {
          id: productId,
          quantity: productQuantity,
          size: productsize,
        } = product;

        const productInCart = cart.some(
          ({ id: productIdCart, size: productSizeCart }) =>
            productIdCart === productId && productSizeCart == productsize,
        );

        if (!productInCart) {
          set(({ cart }) => ({ cart: [...cart, product] }));
          return;
        }

        const updateCartProduct = cart.map((item) => {
          if (item.id === productId && item.size === productsize) {
            return {
              ...item,
              quantity: item.quantity + productQuantity,
            };
          }

          return item;
        });

        set({ cart: updateCartProduct });
      },
      remove: (product) => {
        const { cart } = get();

        const filterProducts = cart.filter(
          (item) => item.id != product.id && item.size != product.size,
        );

        set({ cart: filterProducts });
      },
      updateProducQuantity: (product, quantity) => {
        const { cart } = get();

        const updateCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return {
              ...item,
              quantity,
            };
          }
          return item;
        });

        set({ cart: updateCartProducts });
      },
    }),
    {
      name: "shopping-cart",
    },
  ),
);
