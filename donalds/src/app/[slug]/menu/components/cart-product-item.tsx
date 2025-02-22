import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/util/format-currency";

import { CartProduct } from "../contexts/cart-context"

interface CartProductItemProps {
    product: CartProduct;
}

const CartProductItem = ({product}: CartProductItemProps) => {
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
                        <Button className="w-7 h-7 rounded-lg" variant={"outline"}>
                            <ChevronLeftIcon />
                        </Button>
                        <p className="text-xs w-7">{product.quantity}</p>
                        <Button className="w-7 h-7 rounded-lg" variant={"destructive"}>
                            <ChevronRightIcon />
                        </Button>
                    </div>
                </div>
            </div>

            {/* BOTAO DELETAR */}
            <Button className="w-7 h-7 rounded-lg" variant={"outline"}>
                <TrashIcon />
            </Button>

        </div>
    );
}
 
export default CartProductItem;