import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BidIQ — The Auction Appraisal Game",
  description:
    "Think you know what it's worth? Lock in your prediction, wait for the hammer, and prove your expertise.",
  keywords: ["auction", "appraisal", "game", "prediction", "bidding"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0A0A0F] text-[#F1F1F5] antialiased">
        {children}
      </body>
    </html>
  );
}
