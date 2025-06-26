"use client";

import { SWRConfig } from "swr";

type Props = {
  children: React.ReactNode;
};

/**
 * SWR configuration provider for global caching
 */
export function SWRProvider({ children }: Props) {
  return (
    <SWRConfig
      value={{
        // Global SWR options
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 60 * 60 * 1000, // 1 hour deduping
      }}
    >
      {children}
    </SWRConfig>
  );
}
