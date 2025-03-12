import { Metadata } from "next";
import "./globals.css";
import { inter } from "@/lib/fonts";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "Worker Management",
  description: "Find and manage workers easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
