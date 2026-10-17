import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/providers/WalletProvider";
import { PwaRegister } from "@/components/PwaRegister";
import { TabBar } from "@/components/TabBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Qalta — личный кошелек",
  description: "Личный кошелёк для учёта расходов",
  applicationName: "Qalta",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Qalta",
    statusBarStyle: "default",
  },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F6F7F9",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <WalletProvider>
          <main className="mx-auto min-h-dvh w-full max-w-md px-4 pt-6">
            <header className="mb-4 flex items-center justify-between">
              <span className="text-lg font-bold tracking-tight">
                <span className="text-primary">Qalta</span>
              </span>
            </header>
            {children}
          </main>
          <TabBar />
          <PwaRegister />
        </WalletProvider>
      </body>
    </html>
  );
}
