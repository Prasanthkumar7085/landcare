"use client";
import { Providers } from "@/redux/Provider";
import { usePathname } from "next/navigation";
import "./globals.css";
import "@/components/styles/app.scss";
import { Toaster } from "sonner";
import Navbar from "@/components/Layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <body>
        <Providers>
          {pathname == "/maps" ? <Navbar>{children}</Navbar> : children}
        </Providers>
      </body>
      <Toaster richColors closeButton position="top-center"/>
    </html>
  );
}
