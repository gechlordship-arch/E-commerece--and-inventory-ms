import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "./lib/prisma";
import Link from "next/link";
import Navbar from "./components/Navbar";

// This is the dynamic part that fetches data
async function ProductGrid() {
  await connection(); 

  const products = await prisma.product.findMany({
    where: { status: "active" },
    include: {
      variants: {
        include: { inventory: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
        <p className="mt-1 text-gray-500">Get started by adding a product in the admin dashboard.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {products.map((product) => {
        const totalStock = product.variants.reduce(
          (total, variant) => total + (variant.inventory?.quantity || 0), 
          0
        );
        const minPrice = Math.min(...product.variants.map(v => v.priceCents));

        return (
          <Link 
            href={`/products/${product.slug}`} 
            key={product.id} 
            className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow block"
          >
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="aspect-[4/3] w-full object-cover"
              />
            ) : (
              <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400">
                <span className="text-sm">No Image</span>
              </div>
            )}

            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900">{product.title}</h2>
              <p className="mt-1 text-sm text-gray-500">
                {product.variants.length} option(s)
              </p>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900">
                  From ${(minPrice / 100).toFixed(2)}
                </span>
                
                {totalStock === 0 ? (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                    Out of Stock
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    {totalStock} in stock
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// This is the main page shell
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        <Navbar />

        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading products...</div>}>
          <ProductGrid />
        </Suspense>
        
      </div>
    </div>
  );
}