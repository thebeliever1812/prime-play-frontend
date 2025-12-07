import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import StoreProvider from "./StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PrimePlay",
    template: "%s | PrimePlay",
  },
  description:
    "PrimePlay - Stream your favorite videos, explore creators, and enjoy seamless entertainment.",
  metadataBase: new URL("https://prime-play-frontend.vercel.app"),
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    title: "PrimePlay",
    capable: true,
    statusBarStyle: "default",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "PrimePlay",
    description:
      "PrimePlay - Stream your favorite videos, explore creators, and enjoy seamless entertainment.",
    url: "https://prime-play-frontend.vercel.app",
    siteName: "PrimePlay",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PrimePlay - Video Streaming Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrimePlay",
    description:
      "Stream your favorite videos, explore creators, and enjoy seamless entertainment.",
    images: ["/og-image.png"],
  }
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
        <StoreProvider>
          {children}
        </StoreProvider>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </body>
    </html>
  );
}
