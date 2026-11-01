"use server";

import { prisma } from "../lib/prisma";

export async function createOrder(
  customerData: { name: string; email: string; address: string },
  cartItems: { variantId: string; quantity: number; priceCents: number }[]
) {
  try {
    // We use a transaction to ensure stock is deducted safely
    const order = await prisma.$transaction(async (tx) => {
      
      // 1. Calculate total price
      const totalCents = cartItems.reduce(
        (total, item) => total + item.priceCents * item.quantity, 0
      );

      // 2. Create the Order
      const newOrder = await tx.order.create({
        data: {
          customerName: customerData.name,
          customerEmail: customerData.email,
          address: customerData.address,
          totalCents,
          items: {
            create: cartItems.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              priceCents: item.priceCents,
            })),
          },
        },
      });

      // 3. Deduct Inventory
      for (const item of cartItems) {
        // Check if we have enough stock
        const inventory = await tx.inventory.findUnique({
          where: { variantId: item.variantId },
        });

        if (!inventory || inventory.quantity < item.quantity) {
          throw new Error("Not enough stock for one of the items!");
        }

        // Deduct the stock
        await tx.inventory.update({
          where: { variantId: item.variantId },
          data: { quantity: inventory.quantity - item.quantity },
        });
      }

      return newOrder;
    });

    return { success: true, orderId: order.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}