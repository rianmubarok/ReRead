import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import "../styles/animations.css";
import "../styles/walkthrough.css";
import MobileContainer from "@/components/layout/MobileContainer";
import BottomNav from "@/components/navigation/BottomNav";
import { NavProvider } from "@/context/NavContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReRead App",
  description: "ReRead App",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} antialiased`}
      >
        <AuthProvider>
          <NavProvider>
            <MobileContainer>
              <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
                {children}
              </main>
              <BottomNav />
            </MobileContainer>
          </NavProvider>
        </AuthProvider>
        <Toaster position="top-center" toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
          className: 'text-sm font-medium',
        }} />
      </body>
    </html>
  );
}
