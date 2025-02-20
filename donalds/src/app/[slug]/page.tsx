import Image from "next/image";
import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

import ConsuptionMethodOption from "./components/consuption-method-option";

interface RestaurantPageProps {
  params: Promise<{ slug: string }>;
}

const RestaurantPage = async ({ params }: RestaurantPageProps) => {
  const { slug } = await params;
  const restaurant = await db.restaurant.findUnique({ where: { slug } });
  if (!restaurant) {
    return notFound();
  }

  return (
    <div className="h-[h-screen flex flex-col items-center justify-center px-6 pt-24">
      {/* Logo e titulo */}
      <div className="flex flex-col items-center gap-2">
        <Image
          src={restaurant.avatarImageUrl}
          alt={restaurant.name}
          width={82}
          height={82}
        />
        <h2 className="font-semibold">{restaurant.name}</h2>
      </div>

      {/* bem vindo */}
      <section className="space-y-2 pt-24 text-center">
        <h3 className="text-2xl font-semibold">Seja bem vindo!</h3>
        <p className="opacity-55">
          Escolha como prefere aproveitar sua refeição. Estamos aqui para
          oferecer praticidade e sabor em cada detalhe!
        </p>
      </section>

      <div className="grid grid-cols-2 gap-4 pt-14">
        <ConsuptionMethodOption
          slug={slug}
          imageUrl="/dine_in.png"
          buttonText="Para comer aqui"
          imageAlt="para comer aqui"
          option="DINE_IN"
        />

        <ConsuptionMethodOption
          slug={slug}
          imageUrl="/take_away.png"
          buttonText="Para levar"
          imageAlt="para levar"
          option="TAKE_AWAY"
        />
      </div>
    </div>
  );
};

export default RestaurantPage;
