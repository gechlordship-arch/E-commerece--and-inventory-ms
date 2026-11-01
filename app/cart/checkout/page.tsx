"use client";

import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../actions/checkout";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;

    // Call the Server Action
    const result = await createOrder({ name, email, address }, cart);

    if (result.success) {
      clearCart();
      router.push(`/cart/checkout/success?orderId=${result.orderId}`);
    } else {
      setError(result.error || "Something went wrong");
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/" className="text-blue-600 hover:underline">Go back to store</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto">
        <Navbar />
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>
          
          {error && <div className="bg-red-100 text-red-800 p-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input type="text" name="name" required className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" name="email" required className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Shipping Address</label>
              <textarea name="address" required className="w-full border p-2 rounded" rows={3} />
            </div>

            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total:</span>
                <span>${(cartTotal / 100).toFixed(2)}</span>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}