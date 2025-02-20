import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface ProductsListProps {
    products: Product[];
}

const ProductsList = ({products}: ProductsListProps) => {
    return ( 
        <ol className="space-y-3 px-3">
            {products.map(product => (
                <li key={product.id} className="flex items-center justify-between gap-10 py-3 border-b">
                    <Link href={"/"} className="flex">

                        {/* Esquerda */}
                        <section>
                            <h3 className="text-sm font-medium">
                                {product.name}
                            </h3>
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                {product.description}
                            </p>
                            <p className="pt-3 text-sm font-semibold">
                                {Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                }).format(product.price)}
                            </p>
                        </section>

                        {/* DIREITA */}
                        <div className="relative min-h-[82px] min-w-[120px]">
                            <Image src={product.imageUrl} alt={product.name} fill className="rounded-lg object-contain" />  
                        </div>

                    </Link>
                </li>
            ))}
        </ol>
     );
}
 
export default ProductsList;