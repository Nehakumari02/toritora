import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DMSans,JNFont } from '@/lib/fonts';
import { Toaster } from "@/components/ui/toaster";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${DMSans.variable} font-DM-Sans antialiased h-[100dvh]`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
