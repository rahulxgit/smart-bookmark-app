import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

// ---------------- FONTS ----------------
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // performance optimization
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ---------------- METADATA ----------------
export const metadata = {
  title: {
    default: "Smart Bookmark App",
    template: "%s | Smart Bookmark App",
  },
  description: "Bookmark manager with realtime sync using Next.js + Supabase",
};

// ---------------- ROOT LAYOUT ----------------
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Global Navigation */}
        <Navbar />

        {/* Global Toast Provider */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "10px",
              background: "#111827",
              color: "#fff",
            },
          }}
        />

        {/* Page Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
