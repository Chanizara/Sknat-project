import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sknat good - ผู้เชี่ยวชาญด้านอสังหาริมทรัพย์",
  description: "บริการซื้อ-ขาย-เช่า บ้าน คอนโด ที่ดิน ครบวงจร โดย Sknat good",
  icons: {
    icon: '/favicon.svg',
  },
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
