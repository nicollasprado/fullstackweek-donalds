"use client";

import { OrderStatus, Prisma } from "@prisma/client";
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/util/format-currency";

interface OrderListProps {
  orders: Array<
    Prisma.OrderGetPayload<{
      include: {
        restaurant: {
          select: {
            name: true;
            avatarImageUrl: true;
          };
        };
        orderProducts: {
          include: {
            product: {
              select: {
                name: true;
                price: true;
              };
            };
          };
        };
      };
    }>
  >;
}

const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.FINISHED:
      return "Finalizado";
    case OrderStatus.IN_PREPARATION:
      return "Em preparação";
    case OrderStatus.PENDING:
      return "Pendente";
    case OrderStatus.PAYMENT_FAILED:
      return "Erro no pagamento";
    case OrderStatus.PAYMENT_CONFIRMED:
      return "Pagamento confirmado";
    default:
      return "";
  }
};

const OrderList = ({ orders }: OrderListProps) => {
  const router = useRouter();

  const handleBackClick = () => router.back();

  return (
    <div className="space-y-6 p-6">
      <Button
        size={"icon"}
        variant={"secondary"}
        className="rounded-full"
        onClick={handleBackClick}
      >
        <ChevronLeftIcon />
      </Button>

      <div className="flex items-center gap-3">
        <ScrollTextIcon />
        <h2 className="text-lg font-semibold">Meus pedidos</h2>
      </div>

      <ol>
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="space-y-4 p-5">
              <div
                className={`w-fit rounded-full px-2 py-1 text-xs font-semibold text-white ${
                  order.status === OrderStatus.FINISHED
                    ? "bg-green-500"
                    : order.status === OrderStatus.IN_PREPARATION
                      ? "bg-yellow-300 text-black"
                      : order.status === OrderStatus.PAYMENT_CONFIRMED
                        ? "bg-green-500 text-black"
                        : order.status === OrderStatus.PAYMENT_FAILED
                          ? "bg-red-500 text-white"
                          : "bg-gray-300 text-gray-500"
                } `}
              >
                {getStatusLabel(order.status)}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative h-5 w-5">
                  <Image
                    src={order.restaurant.avatarImageUrl}
                    alt={order.restaurant.name}
                    fill
                    className="rounded-sm object-contain"
                  />
                </div>
                <p className="text-sm font-semibold">{order.restaurant.name}</p>
              </div>
              <Separator />

              <ul className="flex flex-col gap-2">
                {order.orderProducts.map((orderProduct) => (
                  <li key={orderProduct.id} className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-400 text-xs font-semibold text-white">
                      {orderProduct.quantity}
                    </div>
                    <p className="text-sm">{orderProduct.product.name}</p>
                  </li>
                ))}
                <Separator />

                <p className="text-sm font-medium">
                  {formatCurrency(order.total)}
                </p>
              </ul>
            </CardContent>
          </Card>
        ))}
      </ol>
    </div>
  );
};

export default OrderList;
