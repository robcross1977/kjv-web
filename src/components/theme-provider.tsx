"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import type { ComponentProps } from "react";

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

/**
 * Renders children without theme provider during SSR to prevent hydration mismatch
 */
const renderWithoutTheme = (children: React.ReactNode) => <>{children}</>;

/**
 * Renders children with NextThemesProvider after client-side mounting
 */
const renderWithTheme =
  (props: ThemeProviderProps) => (children: React.ReactNode) =>
    <NextThemesProvider {...props}>{children}</NextThemesProvider>;

/**
 * Theme provider that handles SSR/client hydration properly using fp-ts patterns
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return pipe(
    mounted,
    O.fromPredicate((isMounted) => isMounted),
    O.fold(
      () => renderWithoutTheme(children),
      () => renderWithTheme(props)(children)
    )
  );
}
