import "./globals.css";
import { Inter } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tell Em Robert Sent Ya",
  description: "By Robert Crossland",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-full w-full min-h-screen`}>
        <ThemeProvider defaultTheme="system" attribute="class" enableSystem>
          <UserProvider>
            <div className="flex flex-col w-10/12 mx-auto">
              <Header />
              {children}
            </div>
          </UserProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
