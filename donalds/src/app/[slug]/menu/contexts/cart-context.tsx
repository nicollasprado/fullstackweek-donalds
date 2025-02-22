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
    increaseProductQuantity: (productId: string) => void;
    decreaseProductQuantity: (productId: string) => void;
    removeProduct: (productId: string) => void;
}

export const CartContext = createContext<ICartContext>({
    isOpen: false,
    products: [],
    toggleCart: () => {},
    addProduct: () => {},
    increaseProductQuantity: () => {},
    decreaseProductQuantity: () => {},
    removeProduct: () => {},
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

    const increaseProductQuantity = (productId: string) => {
        setProducts(prevProducts => {
            return prevProducts.map(prevProduct => {
                if(prevProduct.id === productId){
                    return {...prevProduct, quantity: prevProduct.quantity + 1}
                }
                return prevProduct
            })
        })
    }

    const decreaseProductQuantity = (productId: string) => {
        setProducts(prevProducts => {
            return prevProducts.map(prevProduct => {
                if(prevProduct.id === productId && prevProduct.quantity > 1){
                    return {...prevProduct, quantity: prevProduct.quantity - 1}
                }
                return prevProduct
            })
        })
    }

    const removeProduct = (productId: string) => {
        const newProductsList = products.filter(product => product.id !== productId);

        setProducts(newProductsList);
    }

    return (
        <CartContext.Provider 
          value={{
            isOpen,
            products,
            toggleCart,
            addProduct,
            increaseProductQuantity,
            decreaseProductQuantity,
            removeProduct,
          }}
        >
            {children}
        </CartContext.Provider>
    )
};