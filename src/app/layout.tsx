import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/providers/StoreProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

export const metadata: Metadata = {
  title: "Carnaval"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.className} antialiased`}
      >
        <StoreProvider>
          <Navbar />
          {children}
          <Footer />
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 5000,
              removeDelay: 1000,
            }}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
