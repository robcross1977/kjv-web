import "./globals.css";
import { Inter } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bible Buddy",
  description: "By Robert Crossland",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${inter.className} w-full h-full min-h-screen`}>
        <ThemeProvider defaultTheme="system" attribute="class">
          <UserProvider>
            <Header />
            {children}
          </UserProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
