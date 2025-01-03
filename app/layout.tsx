import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { poppins } from "./ui/fonts";
import Script from "next/script";
import GoogleAnalytics from "./GoogleAnalytics";
import GoogleAdsense from "./GoogleAdsense";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Royale Clan Manager",
  description: "Track war participation and see your chances of winning clan wars in Clash Royale",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAdsense pId="7923478383972529" />
      </head>
      <GoogleAnalytics />
      <body className={inter.className}>
        {children}
        {/* KOFI FLOATING WIDGET
        <Script
          src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"
          strategy="beforeInteractive"
        />
        <Script id="kofi-donations" strategy="beforeInteractive">
          {`kofiWidgetOverlay.draw('royaleclanmanager', {
            'type': 'floating-chat',
            'floating-chat.donateButton.text': 'Support Me',
            'floating-chat.donateButton.background-color': '#00b9fe',
            'floating-chat.donateButton.text-color': '#fff'
          });`}
        </Script>
        */}
      </body>
    </html>
  );
}
