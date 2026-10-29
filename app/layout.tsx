import type { Metadata } from "next";
import "./globals.css"; // <-- Make sure this is here!

export const metadata: Metadata = {
  title: "E-commerce Inventory App",
  description: "Built with Next.js and Prisma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}