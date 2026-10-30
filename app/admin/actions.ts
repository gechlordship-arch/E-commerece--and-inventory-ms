"use server";

import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  });
  revalidatePath("/admin");
}

export async function updateProduct(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  
  // 1. Handle empty image URLs properly (convert "" to null)
  const imageUrlRaw = formData.get("imageUrl") as string;
  const imageUrl = imageUrlRaw && imageUrlRaw.trim() !== "" ? imageUrlRaw : null;
  
  // 2. Safely parse numbers to prevent NaN errors
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const safePrice = isNaN(price) ? 0 : price;
  const safeStock = isNaN(stock) ? 0 : stock;

  // 3. Add a small suffix to the slug to prevent "Unique Constraint" errors if titles match
  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${id.slice(-4)}`;

  await prisma.product.update({
    where: { id },
    data: {
      title,
      imageUrl,
      slug,
    },
  });

  const variant = await prisma.variant.findFirst({
    where: { productId: id },
  });

  if (variant) {
    await prisma.variant.update({
      where: { id: variant.id },
      data: {
        priceCents: Math.round(safePrice * 100),
        inventory: {
          upsert: {
            create: { quantity: safeStock },
            update: { quantity: safeStock },
          }
        }
      },
    });
  }

  revalidatePath("/admin");
  redirect("/admin");
}