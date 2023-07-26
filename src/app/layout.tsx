import "./globals.css";
import { Inter } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Analytics } from "@vercel/analytics/react";

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
      <body
        className={`${inter.className} bg-sky-700 w-full h-full min-h-screen`}
      >
        <UserProvider>{children}</UserProvider>
        <Analytics />
      </body>
    </html>
  );
}
