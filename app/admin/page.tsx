import { logout } from "../actions/auth";
import { Suspense } from "react";
import Link from "next/link";
import ProductList from "./ProductList";

export default function AdminPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link 
            href="/admin/orders" 
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            View Orders
          </Link>
       
        <Link 
          href="/admin/products/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add New Product
        </Link>

         <form action={logout}>
            <button type="submit" className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 font-medium">
              Logout
            </button>
          </form>
      </div>

      <Suspense fallback={<div className="p-4 border rounded-lg bg-gray-50 text-gray-500">Loading products...</div>}>
        <ProductList />
      </Suspense>
    </div>
  );
}