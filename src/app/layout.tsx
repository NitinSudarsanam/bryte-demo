import type { Metadata } from "next";
import { Geist, Geist_Mono, League_Spartan } from "next/font/google";
import Navigation from "@/app/components/navigation/Navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  weight: "variable",
});

export const metadata: Metadata = {
  title: "BRYTE - Brown Refugee Youth Tutoring & Enrichment",
  description: "BRYTE works with refugee youth grades K-12 in the home, supporting their self-empowerment through academic tutoring and mentoring.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
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
        className={`${geistSans.variable} ${geistMono.variable} ${leagueSpartan.variable} antialiased`}
      >
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
