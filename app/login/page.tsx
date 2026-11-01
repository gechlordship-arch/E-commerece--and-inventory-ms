"use client";

import { useState } from "react";
import { login } from "../actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        
        {error && <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              className="w-full border p-2 rounded"
              placeholder="Enter admin password"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">Back to Store</Link>
        </div>
      </div>
    </div>
  );
}