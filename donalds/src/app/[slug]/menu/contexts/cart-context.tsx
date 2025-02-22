"use client";

import { Product } from "@prisma/client";
import { createContext, ReactNode, useState } from "react";

export interface CartProduct extends Pick<Product, "id" | "name" | "price" | "imageUrl"> {
    quantity: number;
}

export interface ICartContext {
    isOpen: boolean;
    products: CartProduct[];
    toggleCart: () => void;
    addProduct: (product: CartProduct) => void;
}

export const CartContext = createContext<ICartContext>({
    isOpen: false,
    products: [],
    toggleCart: () => {},
    addProduct: () => {},
})


export const CartProvider = ({ children }: {children: ReactNode}) => {
    const [products, setProducts] = useState<CartProduct[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleCart = () => {
        setIsOpen(prev => !prev);
    }

    const addProduct = (product: CartProduct) => {
        const findProduct = products.find(inListProduct => product.id === inListProduct.id);

        if(findProduct){
            const otherProducts: CartProduct[] = products.filter(cartProduct => cartProduct.id !== product.id);

            product.quantity += findProduct.quantity;
            setProducts([...otherProducts, product])
        }else{
            setProducts((prev) => [...prev, product]);
        }

    }

    return (
        <CartContext.Provider 
          value={{
            isOpen,
            products,
            toggleCart,
            addProduct,
          }}
        >
            {children}
        </CartContext.Provider>
    )
};