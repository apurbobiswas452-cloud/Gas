import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grand Auto Services | Luxury Car Service in Chattogram",
  description: "Premium automotive service, repair, detailing, and diagnostics by Grand Auto Services in Chattogram.",
  metadataBase: new URL("https://grandautoservices.example.com"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
