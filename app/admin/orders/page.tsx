import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "../../lib/prisma";
import Link from "next/link";

// 1. Move the database query into a separate dynamic component
async function OrdersList() {
  await connection();

  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          variant: {
            include: { product: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
        <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
        <p className="mt-1 text-gray-500">When customers check out, their orders will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
          
          {/* Order Header */}
          <div className="bg-gray-50 p-4 border-b flex justify-between items-center flex-wrap gap-4">
            <div>
              <p className="font-semibold text-gray-900">Order #{order.id.slice(-6).toUpperCase()}</p>
              <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-green-600">${(order.totalCents / 100).toFixed(2)}</p>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-semibold uppercase tracking-wide">
                {order.status}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="p-4 border-b grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-gray-700">Customer Details</p>
              <p>{order.customerName}</p>
              <p className="text-gray-500">{order.customerEmail}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Shipping Address</p>
              <p className="text-gray-500">{order.address}</p>
            </div>
          </div>

          {/* Items List */}
          <div className="p-4">
            <p className="font-semibold text-gray-700 mb-3 text-sm">Items Ordered</p>
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm items-center">
                  <span>
                    <span className="font-medium">{item.quantity}x</span> {item.variant.product.title} 
                    <span className="text-gray-500"> ({item.variant.title})</span>
                  </span>
                  <span className="font-medium">${((item.priceCents * item.quantity) / 100).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      ))}
    </div>
  );
}

// 2. The main page just renders the shell and streams in the list
export default function AdminOrdersPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Customer Orders</h1>
        <Link 
          href="/admin" 
          className="text-blue-600 hover:underline font-medium"
        >
          &larr; Back to Products
        </Link>
      </div>

      <Suspense fallback={
        <div className="p-8 text-center text-gray-500 border rounded-lg bg-gray-50">
          Loading orders...
        </div>
      }>
        <OrdersList />
      </Suspense>
    </div>
  );
}