import { connection } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { updateProduct } from "../../../actions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Tell Next.js to render this dynamically
  await connection();
  
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: { include: { inventory: true } } }
  });

  if (!product) notFound();

  const variant = product.variants[0];
  const currentStock = variant?.inventory?.quantity || 0;
  const currentPrice = variant ? (variant.priceCents / 100).toFixed(2) : "0.00";

  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <div className="p-8 max-w-md mx-auto">
      <Link href="/admin" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Admin</Link>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form action={updateProductWithId} className="space-y-4 border p-6 rounded-lg shadow-sm bg-white">
        <div>
          <label className="block text-sm font-medium mb-1">Product Title</label>
          <input type="text" name="title" required defaultValue={product.title} className="w-full border p-2 rounded" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input type="url" name="imageUrl" defaultValue={product.imageUrl || ""} className="w-full border p-2 rounded" placeholder="https://..." />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Price ($)</label>
          <input type="number" name="price" step="0.01" required defaultValue={currentPrice} className="w-full border p-2 rounded" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Total Stock</label>
          <input type="number" name="stock" required defaultValue={currentStock} className="w-full border p-2 rounded" />
        </div>
        
        <button type="submit" className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 font-medium">
          Save Changes
        </button>
      </form>
    </div>
  );
}