import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Providers from "@/components/providers";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FamilyTable.AI",
  description: "FamilyTable.AI",
};

type RootLayoutProps = {
  children: React.ReactNode;
};
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} h-full w-full min-h-screen`}>
        <Providers>
          <div className="flex flex-col w-10/12 mx-auto">
            <Header />
            {children}
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
