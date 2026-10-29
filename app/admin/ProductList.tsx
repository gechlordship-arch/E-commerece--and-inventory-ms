// app/admin/ProductList.tsx
import { connection } from "next/server";
import { prisma } from "../lib/prisma";

export default async function ProductList() {
  // 1. Tell Next.js this component must render at request time
  await connection();

  // 2. Now it is safe to run the Prisma query
    const products = await prisma.product.findMany({
    include: { 
      variants: { 
        include: { inventory: true } // <-- Tell Prisma to fetch inventory
      } 
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-4 font-semibold">Product Title</th>
            <th className="p-4 font-semibold">Status</th>
            <th className="p-4 font-semibold">Variants</th>
            <th className="p-4 font-semibold">Total Stock</th> {/* <-- Add this */}

          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b">
              <td className="p-4">{product.title}</td>
              <td className="p-4">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                  {product.status}
                </span>
              </td>
              <td className="p-4">{product.variants.length}</td>
              <td className="p-4 font-mono">
                {product.variants.reduce((total, variant) => total + (variant.inventory?.quantity || 0), 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}