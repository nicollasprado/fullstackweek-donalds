"use client";

import { Prisma} from "@prisma/client";
import { ChefHatIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/util/format-currency";

import CartSheet from "../../components/cart-sheet";
import { CartContext } from "../../contexts/cart-context";

interface ProductDetailsProps{
    product: Prisma.ProductGetPayload<{ 
        include: { 
            restaurant: { 
                select: { 
                    name: true, 
                    avatarImageUrl: true
                } 
            } 
        } 
    }>;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
    const { toggleCart, addProduct } = useContext(CartContext);
 
    const [quantity, setQuantity] = useState<number>(1);

    const handleDecreaseQuantity = () => {
        if(quantity > 1){
            setQuantity((prev) => prev - 1);
        }
    }
    const handleIncreaseQuantity = () => {
        setQuantity((prev) => prev + 1);
    }

    const handleAddToCart = () => {
        addProduct({
            ...product,
            quantity
        });

        toggleCart();
    }

    return (
        <>
          <div className="relative z-50 rounded-t-3xl p-5 mt-[-1.5rem] flex-auto flex flex-col overflow-hidden">
            <div className="flex-auto overflow-hidden">
                {/* Restaurante */}
                <section className="flex items-center gap-1.5">
                    <Image src={product.restaurant.avatarImageUrl} alt={product.restaurant.name} width={16} height={16} className="rounded-full" />
                    <h3 className="text-xs text-muted-foreground">
                        {product.restaurant.name}
                    </h3>
                </section>
                <h1 className="mt-1 text-xl font-semibold">
                    {product.name}
                </h1>
                
                {/* Preço e Quantidade */}
                <section className="flex items-center justify-between mt-3">
                    <h2>
                        {formatCurrency(product.price)}
                    </h2>
                    <div className="flex items-center gap-3 text-center">
                        <Button variant="outline" className="h-8 w-8 rounded-xl" onClick={handleDecreaseQuantity} >
                            <ChevronLeftIcon />
                        </Button>
                        <p className="w-4">{quantity}</p>
                        <Button variant="destructive" className="h-8 w-8 rounded-xl" onClick={handleIncreaseQuantity} >
                            <ChevronRightIcon />
                        </Button>
                    </div>
                </section>

                <ScrollArea className="h-full">
                    {/* SOBRE */}
                    <section className="mt-6 space-y-3">
                        <h4 className="font-semibold">Sobre</h4>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                    </section>
                    
                    {/* Ingredientes */}
                    <section className="mt-6 space-y-3">
                        <div className="flex items-center gap-1.5">
                            <ChefHatIcon size={18} />
                            <h4 className="font-semibold">Ingredientes</h4>
                        </div>
                        
                        <ul className="text-sm text-muted-foreground list-disc px-5">
                            {product.ingredients.map((ingredient, i) => (
                                <li key={i}>
                                    {ingredient}
                                </li>
                            ))}
                        </ul>
                    </section>
                </ScrollArea>
            </div>

            <Button className="mt-6 w-full rounded-full" onClick={handleAddToCart}>
                Adicionar à sacola
            </Button>
          </div>

          <CartSheet />
        </>
    );
}
 
export default ProductDetails;