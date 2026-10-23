import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "La communauté des lecteurs du Revenu",
    template: "%s · Communauté Le Revenu",
  },
  description:
    "Posez vos questions d'argent, partagez vos expériences : bourse, épargne, impôts, retraite, transmission.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2"
        >
          Aller au contenu
        </a>
        <Header />
        <div id="main" className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
          {children}
        </div>
      </body>
    </html>
  );
}
