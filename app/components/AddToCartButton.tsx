"use client";

import { useCart } from "../context/CartContext";

export default function AddToCartButton({ 
  variantId, productTitle, variantTitle, priceCents 
}: { 
  variantId: string; productTitle: string; variantTitle: string; priceCents: number; 
}) {
  const { addToCart } = useCart();

  return (
    <button 
      onClick={() => {
        addToCart({ variantId, productTitle, variantTitle, priceCents, quantity: 1 });
        alert("Added to cart!");
      }}
      className="mt-2 bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
    >
      Add to Cart
    </button>
  );
}