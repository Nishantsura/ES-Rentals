import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Instrument_Sans } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import cn from "classnames";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
// import CrispChat from "@/components/CrispChat";
import { CarHireProvider } from "@/contexts/CarHireContext";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Autoluxe - Luxury Car Rental in Dubai",
  description: "Find the best cars for rent in Dubai. Explore our wide range of luxury vehicles and book your dream car today.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="theme-transition">
      <body
        className={cn(
          "min-h-screen bg-background font-clash antialiased theme-transition",
          "selection:bg-primary selection:text-primary-foreground",
          "flex flex-col",
          inter.variable,
          instrumentSans.variable,
          playfair.variable,
          "font-sans overflow-x-hidden p-0 m-0 w-full"
        )}
        style={{ margin: 0, padding: 0, width: '100%' }}
      >
        <ThemeProvider defaultTheme="dark" storageKey="autoluxe-theme">
          <CarHireProvider>
            <Header />
            <main className="flex-1 w-full">
              {children}
            </main>
            {/* <CrispChat /> */}
            <Footer />
          </CarHireProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
