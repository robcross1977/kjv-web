import "./globals.css";
import { Inter } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bible Buddy",
  description: "By Robert Crossland",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-br from-sky-700 to-sky-500 w-full font-mono`}
      >
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
