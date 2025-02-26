"use server";

import { headers } from "next/headers";
import Stripe from "stripe";

import { db } from "@/lib/prisma";
import { removeCpfPontuation } from "@/util/cpf-validator";

import { CartProduct } from "../contexts/cart-context";

interface CreateStripeCheckoutInput {
  products: CartProduct[];
  orderId: number;
  slug: string;
  consumptionMethod: string;
  cpf: string;
}

export const CreateStripeCheckout = async ({
  products,
  orderId,
  slug,
  consumptionMethod,
  cpf,
}: CreateStripeCheckoutInput) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing stripe secret key");
  }

  const reqHeaders = await headers();
  const origin = reqHeaders.get("origin") as string;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  });

  const productsWithPrices = await db.product.findMany({
    where: {
      id: {
        in: products.map((product) => product.id),
      },
    },
  });

  const searchParams = new URLSearchParams();
  searchParams.set("consumptionMethod", consumptionMethod);
  searchParams.set("cpf", removeCpfPontuation(cpf));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "boleto"],
    mode: "payment",
    success_url: `${origin}/${slug}/orders?${searchParams.toString()}`,
    cancel_url: `${origin}/${slug}/orders?${searchParams.toString()}`,
    metadata: {
      orderId,
    },
    line_items: products.map((product) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: product.name,
          images: [product.imageUrl],
        },
        unit_amount:
          productsWithPrices.find((p) => p.id === product.id)!.price * 100,
      },
      quantity: product.quantity,
    })),
  });

  return { sessionId: session.id };
};
