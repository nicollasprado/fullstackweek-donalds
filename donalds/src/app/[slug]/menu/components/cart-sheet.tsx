import { useContext } from "react";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { CartContext } from "../contexts/cart-context";
import CartProductItem from "./cart-product-item";

const CartSheet = () => {
    const { isOpen, toggleCart, products } = useContext(CartContext);

    return ( 
        <Sheet open={isOpen} onOpenChange={toggleCart} >
            <SheetContent className="w-80%" >
                <SheetHeader>
                    <SheetTitle className="text-left">Sacola</SheetTitle>
                </SheetHeader>

                <ol className="py-5">
                    {products.map(product => (
                        <li key={product.id}>
                            <CartProductItem product={product} />
                        </li>
                    ))}
                </ol>
            </SheetContent>
        </Sheet>
     );
}
 
export default CartSheet;