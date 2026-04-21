import { Cairo, Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/providers/StoreProvider";
import { getMainMetadata } from "@/metadata";
import { i18n, LANGUAGES } from "@/constants/i18n";
import { Language } from "@/types/i18n";
import getTranslation from "@/utils/translation";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

const cairo = Cairo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export default async function RootLayout({
  children,
  params
}: LayoutProps<"/[lang]">) {

  const { lang } = await params as { lang: Language }

  const translation = await getTranslation(lang)

  return (
    <html
      lang={lang}
      dir={lang === LANGUAGES.arabic ? "rtl" : "ltr"}
      data-scroll-behavior="smooth"
    >
      <body
        className={`${lang === LANGUAGES.arabic ? cairo.className : inter.className} antialiased relative font-`}
      >
        <StoreProvider>
          <Navbar
            lang={lang}
            translation={translation}
          />
          {children}
          <Footer translation={translation.footer} />
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 5000,
              removeDelay: 1000,
              style: {
                padding: "20px"
              }
            }}
          />
        </StoreProvider>
      </body>
    </html>
  )
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">) {

  const { lang } = await params as { lang: Language }

  return await getMainMetadata(lang)
}

export function generateStaticParams() {
  return i18n.languages.map(lang => ({ lang }))
}