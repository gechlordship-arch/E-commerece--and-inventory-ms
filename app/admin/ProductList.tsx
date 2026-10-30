import { connection } from "next/server";
import { prisma } from "../lib/prisma";
import Link from "next/link";
import { deleteProduct } from "./actions";

export default async function ProductList() {
  await connection();

  const products = await prisma.product.findMany({
    include: { 
      variants: { 
        include: { inventory: true } 
      } 
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <table className="w-full text-left">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-4 font-semibold">Product Title</th>
            <th className="p-4 font-semibold">Status</th>
            <th className="p-4 font-semibold">Variants</th>
            <th className="p-4 font-semibold">Total Stock</th>
            <th className="p-4 font-semibold text-right">Actions</th>
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
                {product.variants.reduce((total: number, variant) => {
                  return total + (variant.inventory?.quantity || 0);
                }, 0)}
              </td>
              <td className="p-4 text-right flex gap-4 justify-end items-center">
                <Link href={`/admin/products/${product.id}/edit`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                  Edit
                </Link>
                <form action={async () => {
                  "use server";
                  await deleteProduct(product.id);
                }}>
                  <button type="submit" className="text-red-600 hover:text-red-800 font-medium text-sm">
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}