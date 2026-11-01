"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, cartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/" className="text-blue-600 hover:underline">Go back to store</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-8 inline-block">&larr; Back to Store</Link>
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item.variantId} className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{item.productTitle}</h3>
                  <p className="text-sm text-gray-500">{item.variantTitle} (x{item.quantity})</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${((item.priceCents * item.quantity) / 100).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.variantId)} className="text-red-500 text-sm hover:underline mt-1">
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-2xl font-bold">${(cartTotal / 100).toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button onClick={clearCart} className="text-gray-500 hover:text-black underline text-sm">
            Clear Cart
          </button>
           <Link 
            href="/cart/checkout" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}