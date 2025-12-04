import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SkyLake News – Breaking & Latest News",
  description: "Reliable breaking news, global headlines, and real-time updates — powered by SkyLake News.",
  icons: {
    icon: "/favicon-v2.ico",
    apple: "/apple-touch-icon-v2.png",
  },
  openGraph: {
    title: "SkyLake News",
    description: "Breaking news. Real-time coverage. Global headlines.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
