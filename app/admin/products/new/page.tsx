import { prisma } from "../../../lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewProductPage() {
  
  async function createProduct(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string) || 0;
    
    // 1. Safely handle the image URL
    const rawImageUrl = formData.get("imageUrl") as string;
    const imageUrl = rawImageUrl && rawImageUrl.trim() !== "" ? rawImageUrl : null;
    
    const store = await prisma.store.findFirstOrThrow();

    await prisma.product.create({
      data: {
        title: title,
        // 2. Generate a unique slug so it never crashes
        slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`, 
        imageUrl: imageUrl,
        storeId: store.id,
        status: "active",
        variants: {
          create: {
            sku: `SKU-${Date.now()}`,
            title: "Default",
            priceCents: Math.round(price * 100),
            inventory: {
              create: { quantity: stock }
            }
          }
        }
      },
    });

    redirect("/admin");
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <Link href="/admin" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Admin
      </Link>
      
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form action={createProduct} className="space-y-4 border p-6 rounded-lg shadow-sm bg-white">
        <div>
          <label className="block text-sm font-medium mb-1">Product Title</label>
          <input type="text" name="title" required className="w-full border p-2 rounded" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Price ($)</label>
          <input type="number" name="price" step="0.01" required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Initial Stock</label>
          <input type="number" name="stock" required defaultValue="0" className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL (Optional)</label>
          <input type="url" name="imageUrl" className="w-full border p-2 rounded" placeholder="https://..." />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium">
          Save Product
        </button>
      </form>
    </div>
  );
}