import { db } from "@/lib/prisma";
import { isValidCpf, removeCpfPontuation } from "@/util/cpf-validator";

import CpfForm from "./components/cpf-form";
import OrderList from "./components/order-list";

interface OrdersPageProps {
    searchParams: Promise<{ cpf: string }>
}

const OrdersPage = async ({ searchParams }: OrdersPageProps ) => {
    const { cpf } = await searchParams;

    if(!cpf){
        return <CpfForm />;
    }

    if(!isValidCpf(cpf)){
        return <CpfForm />;
    }

    const orders = await db.order.findMany({ 
        orderBy: {
            createdAt: "desc",
        },
        where: { 
            customerCpf: removeCpfPontuation(cpf) 
        },
        include: {
            restaurant: {
                select: {
                    name: true,
                    avatarImageUrl: true,
                }
            },
            orderProducts: {
                include: {
                    product: {
                        select: {
                            price: true,
                            name: true,
                        }
                    }
                }
            }
        }
    })

    return ( 
        <OrderList orders={orders} />
    );
}
 
export default OrdersPage;