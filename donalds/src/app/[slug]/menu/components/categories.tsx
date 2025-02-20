"use client";

import { Prisma } from "@prisma/client";
import { ClockIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import ProductsList from "./products";

interface RestaurantCategoriesProps {
  restaurant: Prisma.RestaurantGetPayload<{
    include: {
      menuCategories: {
        include: { products: true };
      };
    };
  }>;
}

type MenuCategoryWithProducts = Prisma.MenuCategoryGetPayload<{
    include: {products: true};
}>;

const RestaurantCategories = ({ restaurant }: RestaurantCategoriesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryWithProducts>(restaurant.menuCategories[0]);
  const handleCategoryClick = (category: MenuCategoryWithProducts) => {
    setSelectedCategory(category);
  }
  
  const getCategoryVariantButton = (category: MenuCategoryWithProducts) => {
    return selectedCategory.id === category.id ? "default" : "secondary";
  }

  return (
    <div className="rounded-t-3xl relative z-50 mt-[-1.5rem] bg-white">
      <div className="p-5">
          <div className="flex items-center gap-3">
            <Image
              src={restaurant.avatarImageUrl}
              alt={restaurant.name}
              height={45}
              width={45}
            />
            <div>
              <h2 className="text-lg font-semibold">{restaurant.name}</h2>
              <p className="text-xs opacity-55">{restaurant.description}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-green-500">
            <ClockIcon size={12} />
            <p>Aberto!</p>
          </div>
      </div>

      <ScrollArea className="w-full">
        <ol className="flex w-max space-x-4 p-2 pt-0">
          {restaurant.menuCategories.map((category) => (
            <li key={category.id}>
                <Button onClick={() => handleCategoryClick(category)} variant={getCategoryVariantButton(category)} size={"sm"} className="rounded-full">
                  {category.name}
                </Button>
            </li>
          ))}
        </ol>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

          <h3 className="px-3 pt-8 font-semibold">{selectedCategory.name}</h3>
      <ProductsList products={selectedCategory.products} />
    </div>
  );
};

export default RestaurantCategories;
