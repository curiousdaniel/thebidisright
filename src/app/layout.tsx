import type { Metadata } from "next";
import "./globals.css";
import { DemoModeProvider } from "@/contexts/DemoModeContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: "The Bid is Right — The Auction Appraisal Game",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('thebidisright_theme');document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(t==='light'?'light':'dark');})();`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
        <ThemeProvider>
          <DemoModeProvider>{children}</DemoModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
