import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DMSans,JNFont } from '@/lib/fonts';
import { Toaster } from "@/components/ui/toaster";
import {NextIntlClientProvider} from 'next-intl';
import { getLocale, getMessages } from "next-intl/server";

const defaultUrl = process.env.NEXT_PUBLIC_DOMAIN_NAME
  ? `${process.env.NEXT_PUBLIC_DOMAIN_NAME}`
  : "http://localhost:3000"

export const metadata:Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Toritora",
  description: "A great application for Photographers & Models and it is Easy to use, High Security & Great Usability",
  icons: {
    icon: [{ url: "/adaptive-icon.png", sizes: "196x196", type: "image/png" }],
    apple: [{ url: "/icon.png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
}
 
export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <head>
        <meta name="apple-mobile-web-app-title" content="Toritora" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body
        className={`${DMSans.variable} font-DM-Sans antialiased h-[100dvh]`}
      >
        <NextIntlClientProvider messages={messages}>
        {children}
        <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
