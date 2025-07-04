import "./globals.css";
import { EB_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/theme-provider";
import { ToolsProvider } from "@/components/tools/tools-provider";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import { SWRProvider } from "@/components/swr-provider";

const font = EB_Garamond({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "Verse Vibe",
  description: "By Robert Crossland",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const bodyClasses = `${font.className} w-full min-h-screen bg-[#9F9F9F]`;
  const containerClasses =
    "border-2 shadow-2xl border-black flex flex-col w-full md:w-10/12 mx-auto bg-background rounded-lg md:my-4 p-1 pb-4 max-w-6xl min-h-[calc(100vh-2rem)]";

  return (
    <html lang="en">
      <body className={bodyClasses}>
        <SWRProvider>
          <AuthSessionProvider>
            <ThemeProvider>
              <ToolsProvider>
                <div className={containerClasses}>{children}</div>
              </ToolsProvider>
            </ThemeProvider>
          </AuthSessionProvider>
        </SWRProvider>
        <Analytics />
      </body>
    </html>
  );
}
