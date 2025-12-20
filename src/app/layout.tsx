import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "House of Supplements | Suplementi za ishranu sportista",
    template: "%s | House of Supplements",
  },
  description:
    "Vaša pouzdana destinacija za visokokvalitetne suplemente za ishranu. Proteini, vitamini, aminokiseline i oprema za trening.",
  keywords: [
    "suplementi",
    "proteini",
    "whey protein",
    "bcaa",
    "kreatin",
    "vitamini",
    "fitness",
    "bodybuilding",
    "Srbija",
  ],
  authors: [{ name: "House of Supplements" }],
  creator: "House of Supplements",
  openGraph: {
    type: "website",
    locale: "sr_RS",
    url: "https://houseofsupplements.rs",
    siteName: "House of Supplements",
    title: "House of Supplements | Suplementi za ishranu sportista",
    description:
      "Vaša pouzdana destinacija za visokokvalitetne suplemente za ishranu.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr" suppressHydrationWarning>
      <body
        className={`${bebasNeue.variable} ${dmSans.variable} font-sans`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
