import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center mb-12 border-b pb-6">
      <Link href="/">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 hover:text-gray-700">My Store</h1>
      </Link>
      <div className="flex gap-6 items-center">
        <Link href="/admin" className="text-sm font-medium text-gray-500 hover:text-gray-900">
          Admin Dashboard
        </Link>
        <Link href="/cart" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          View Cart
        </Link>
      </div>
    </header>
  );
}