import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AAINA BOUTIQUE - Premium Indian Ethnic Wear",
  description: "Discover beautiful Kurtis, Sarees and more at AAINA BOUTIQUE. Premium Indian ethnic wear for women.",
  keywords: ["kurti", "saree", "Indian wear", "ethnic", "boutique", "women fashion"],
  authors: [{ name: "AAINA BOUTIQUE" }],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#DAA520",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream-50">
        {children}
      </body>
    </html>
  );
}
