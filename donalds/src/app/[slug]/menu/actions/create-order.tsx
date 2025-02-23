"use server";

import { ConsumptionMethod, OrderStatus } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

import { db } from "@/lib/prisma";
import { removeCpfPontuation } from "@/util/cpf-validator";

interface CreateOrderProps {
  customerName: string;
  customerCpf: string;
  products: Array<{
    id: string;
    quantity: number;
  }>;
  consumptionMethod: ConsumptionMethod;
  slug: string;
}

export const CreateOrder = async (input: CreateOrderProps) => {
  const restaurant = await db.restaurant.findUnique({
    where: { slug: input.slug },
  });

  if (!restaurant) {
    return notFound();
  }

  const productsWithPrices = await db.product.findMany({
    where: {
      id: {
        in: input.products.map((product) => product.id),
      },
    },
  });

  const productsWithPricesAndQuantities = input.products.map((product) => ({
    productId: product.id,
    quantity: product.quantity,
    price: productsWithPrices.find((p) => p.id === product.id)!.price,
  }));

  await db.order.create({
    data: {
      restaurantId: restaurant.id,
      consumptionMethod: input.consumptionMethod,
      status: OrderStatus.PENDING,
      customerName: input.customerName,
      customerCpf: removeCpfPontuation(input.customerCpf),
      orderProducts: {
        createMany: {
          data: productsWithPricesAndQuantities,
        },
      },
      total: productsWithPricesAndQuantities.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0,
      ),
    },
  });

  redirect(`/${input.slug}/orders`);
};
