import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mahabodhi Internship Program",
  description: "Ras Bihari High School Nalanda - Internship Platform",
  manifest: "/manifest.json",
  themeColor: "#667eea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {children}
      </body>
    </html>
  );
}
