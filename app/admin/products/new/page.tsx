import { prisma } from "../../../lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewProductPage() {
  
  // This is the Server Action that runs when you submit the form
  async function createProduct(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string) || 0; // <-- 1. Grab the stock
    
    // Get the store we seeded earlier
    const store = await prisma.store.findFirstOrThrow();

    // Create the product, variant, AND inventory
    await prisma.product.create({
      data: {
        title: title,
        slug: title.toLowerCase().replace(/ /g, '-'), 
        storeId: store.id,
        status: "active",
        variants: {
          create: {
            sku: `SKU-${Date.now()}`,
            title: "Default",
            priceCents: Math.round(price * 100),
            inventory: {
              create: { quantity: stock } // <-- 2. Save the stock into the database
            }
          }
        }
      },
    });

    // Send the user back to the dashboard
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
          <input 
            type="text" 
            name="title" 
            required 
            className="w-full border p-2 rounded"
            placeholder="e.g. Cool Hoodie"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Price ($)</label>
          <input 
            type="number" 
            name="price" 
            step="0.01" 
            required 
            className="w-full border p-2 rounded"
            placeholder="e.g. 49.99"
          />
        </div>

        {/* 3. Add the new input field to the UI */}
        <div>
          <label className="block text-sm font-medium mb-1">Initial Stock</label>
          <input 
            type="number" 
            name="stock" 
            required 
            defaultValue="0"
            className="w-full border p-2 rounded"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium"
        >
          Save Product
        </button>
      </form>
    </div>
  );
}