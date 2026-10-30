import { connection } from "next/server";
import { prisma } from "../../lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "../../components/AddToCartButton";
import Navbar from "../../components/Navbar";

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  await connection();
  
  const { slug } = await params;

  // Use findFirst because slug is not globally unique in our schema
  const product = await prisma.product.findFirst({
    where: { slug },
    include: {
      variants: {
        include: { inventory: true }
      }
    }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        <Navbar />

        <Link href="/" className="text-blue-600 hover:underline mb-8 inline-block">
          &larr; Back to Store
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Side: Product Image */}
          <div>
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="w-full aspect-square object-cover rounded-lg"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400 rounded-lg">
                <span>No Image</span>
              </div>
            )}
          </div>

          {/* Right Side: Product Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Available Options</h2>
              
              <div className="space-y-4">
                {product.variants.map((variant) => {
                  const stock = variant.inventory?.quantity || 0;
                  const price = (variant.priceCents / 100).toFixed(2);

                  return (
                    <div key={variant.id} className="flex items-center justify-between border p-4 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{variant.title}</p>
                        <p className="text-sm text-gray-500">SKU: {variant.sku}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${price}</p>
                        
                        {stock > 0 ? (
                          <AddToCartButton 
                            variantId={variant.id}
                            productTitle={product.title}
                            variantTitle={variant.title}
                            priceCents={variant.priceCents}
                          />
                        ) : (
                          <p className="text-red-600 text-sm font-medium mt-2">Out of stock</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}