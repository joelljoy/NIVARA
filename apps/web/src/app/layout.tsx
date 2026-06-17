import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Toaster } from "@/components/ui/Toaster";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: "%s | NIVARA Health",
    default: "NIVARA — Your Health, Simplified",
  },
  description:
    "NIVARA is an AI-powered health data management system that helps patients, doctors, and families manage health records securely.",
  keywords: ["health records", "medical records", "AI health", "digital health", "India health"],
  authors: [{ name: "NIVARA Health" }],
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "NIVARA — Your Health, Simplified",
    description: "AI-powered health data management for patients, doctors, and families.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "NIVARA Health",
    description: "AI-powered health data management",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
