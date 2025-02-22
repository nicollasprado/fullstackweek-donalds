import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useContext } from "react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/util/format-currency";

import { CartContext, CartProduct } from "../contexts/cart-context"

interface CartProductItemProps {
    product: CartProduct;
}

const CartProductItem = ({product}: CartProductItemProps) => {
    const { increaseProductQuantity, decreaseProductQuantity, removeProduct } = useContext(CartContext); 

    const handleDecreaseProductQuantity = () => {
        decreaseProductQuantity(product.id);
    }

    const handleIncreaseProductQuantity = () => {
        increaseProductQuantity(product.id);
    }

    const handleRemoveProduct = () => {
        removeProduct(product.id);
    }

    return ( 
        <div className="flex items-center justify-between">

            {/* ESQUERDA */}
            <div className="flex items-center gap-3">
                <div className="relative h-20 w-20 bg-gray-100 p-5 rounded-xl">
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                </div>

                <div className="space-y-1">
                    <p className="text-xs">{product.name}</p>
                    <p className="text-sm font-semibold">{formatCurrency(product.price)}</p>

                    {/* QUANTIDADE */}
                    <div className="flex items-center gap-1 text-center">
                        <Button className="w-7 h-7 rounded-lg" variant={"outline"} onClick={handleDecreaseProductQuantity}>
                            <ChevronLeftIcon />
                        </Button>

                        <p className="text-xs w-7">{product.quantity}</p>

                        <Button className="w-7 h-7 rounded-lg" variant={"destructive"} onClick={handleIncreaseProductQuantity}>
                            <ChevronRightIcon />
                        </Button>
                    </div>
                </div>
            </div>

            {/* BOTAO DELETAR */}
            <Button className="w-7 h-7 rounded-lg" variant={"outline"} onClick={handleRemoveProduct}>
                <TrashIcon />
            </Button>

        </div>
    );
}
 
export default CartProductItem;