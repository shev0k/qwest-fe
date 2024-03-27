import { Poppins } from "next/font/google";
import SiteHeader from "./(client-components)/(Header)/SiteHeader";
import ClientCommons from "./ClientCommons";
import "./globals.css";
import "@/fonts/line-awesome-1.3.0/css/line-awesome.css";
import "@/styles/index.scss";
import "rc-slider/assets/index.css";
import Footer from "@/components/Footer";
import FooterNav from "@/components/FooterNav";
import { Metadata } from "next";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "𝕢𝕎𝕖𝕤𝕥 ﹤𝕋𝕣𝕒𝕧𝕖𝕝﹥",
  description: "travel project",
  keywords: "QWEST, booking, pain",
  viewport:
    "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
    icons: {
      icon: {
        url: "/favicon.ico",
        type: "image/ico",
      },
      shortcut: { url: "/favicon.ico", type: "image/ico" },
    },
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
        <ClientCommons />
        <SiteHeader />
        {children}
        <FooterNav />
        <Footer />
      </body>
    </html>
  );
}
