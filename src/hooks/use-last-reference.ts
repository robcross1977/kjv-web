import { useCallback } from "react";
import useSWR from "swr";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import {
  LastReferenceError,
  LastReferenceResult,
  OptionalLastReference,
  LastReferenceResponse,
  UseLastReferenceState,
  UseLastReferenceActions,
} from "@/types/last-reference";

/**
 * Fetches the user's last Bible reference from the API
 */
const fetchLastReference = (): TE.TaskEither<
  LastReferenceError,
  string | null
> =>
  TE.tryCatch(
    async () => {
      console.log("API CALL: Fetching last reference from server...");

      const response = await fetch("/api/user/last-reference", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("API CALL: Response status:", response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("USER_NOT_AUTHENTICATED");
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data: LastReferenceResponse = await response.json();
      console.log("API CALL: Response data:", data);

      if (!data.success) {
        throw new Error(data.message || "Unknown error");
      }

      const reference = data.lastReference;
      console.log("API CALL: Returning last reference:", reference);
      return reference;
    },
    (error) => {
      console.error("API CALL: Error:", error);
      if (error instanceof Error) {
        if (error.message === "USER_NOT_AUTHENTICATED") {
          return "USER_NOT_AUTHENTICATED" as LastReferenceError;
        }
        if (error.message.startsWith("HTTP")) {
          return "NETWORK_ERROR" as LastReferenceError;
        }
      }
      return "NETWORK_ERROR" as LastReferenceError;
    }
  );

/**
 * Saves the user's last Bible reference to the API
 */
const saveLastReference = (
  reference: string
): TE.TaskEither<LastReferenceError, string> =>
  TE.tryCatch(
    async () => {
      const response = await fetch("/api/user/last-reference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reference }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: LastReferenceResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Unknown error");
      }

      return data.lastReference || reference;
    },
    (error) => {
      console.error("Failed to save last reference:", error);
      return "NETWORK_ERROR" as LastReferenceError;
    }
  );

/**
 * SWR fetcher function that unwraps the TaskEither
 */
const lastReferenceFetcher = async (): Promise<string | null> => {
  const result = await fetchLastReference()();
  return pipe(
    result,
    E.fold(
      (error) => {
        // Don't throw for auth errors - just return null
        if (error === "USER_NOT_AUTHENTICATED") {
          return null;
        }
        throw new Error(error);
      },
      (reference) => reference
    )
  );
};

/**
 * Hook for managing user's last visited Bible reference using SWR
 * @param enabled - Whether to fetch data automatically (default: true)
 */
export const useLastReference = (
  enabled: boolean = true
): UseLastReferenceState & UseLastReferenceActions => {
  const {
    data: lastReferenceData,
    error: swrError,
    isLoading,
    mutate,
  } = useSWR(
    enabled ? "last-reference" : null, // Only fetch when enabled
    lastReferenceFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // Prevent duplicate requests within 5 seconds
    }
  );

  // Convert SWR data to our Option type
  const lastReference: OptionalLastReference = lastReferenceData
    ? O.some(lastReferenceData)
    : O.none;

  // Convert SWR error to our error type
  const error: O.Option<LastReferenceError> = swrError
    ? O.some("NETWORK_ERROR" as LastReferenceError)
    : O.none;

  /**
   * Updates the user's last reference with optimistic updates
   */
  const updateLastReference = useCallback(
    async (reference: string): Promise<LastReferenceResult> => {
      // Optimistic update
      mutate(reference, false);

      const result = await saveLastReference(reference)();

      return pipe(
        result,
        E.fold(
          (err) => {
            // Revert optimistic update on error
            mutate();
            return E.left(err);
          },
          (savedReference) => {
            // Confirm the update
            mutate(savedReference, false);
            return E.right(savedReference);
          }
        )
      );
    },
    [mutate]
  );

  /**
   * Clears the user's last reference
   */
  const clearLastReference =
    useCallback(async (): Promise<LastReferenceResult> => {
      // Optimistic update
      mutate(null, false);

      const result = await saveLastReference("")();

      return pipe(
        result,
        E.fold(
          (err) => {
            mutate(); // Revert on error
            return E.left(err);
          },
          () => {
            mutate(null, false);
            return E.right("");
          }
        )
      );
    }, [mutate]);

  /**
   * Manually refreshes the last reference
   */
  const refreshLastReference = useCallback(async (): Promise<void> => {
    await mutate();
  }, [mutate]);

  return {
    // State
    lastReference,
    isLoading: isLoading || false, // SWR's isLoading can be undefined
    error,
    hasFetched: lastReferenceData !== undefined || swrError !== undefined,

    // Actions
    updateLastReference,
    clearLastReference,
    refreshLastReference,
  };
};

/**
 * Helper hook for automatic reference saving when user navigates
 * Call this in components where you want to automatically save the current reference
 * @param currentReference - The current reference to save
 * @param enabled - Whether auto-saving is enabled (default: true)
 */
export const useAutoSaveReference = (
  currentReference: string | null,
  enabled: boolean = true
) => {
  const { updateLastReference } = useLastReference(false); // Don't auto-fetch in auto-save hook

  // Use SWR's mutate for debounced saving
  useSWR(
    enabled && currentReference ? ["auto-save", currentReference] : null,
    async () => {
      console.log("AUTO-SAVE: Saving reference:", currentReference);
      if (currentReference) {
        const result = await saveLastReference(currentReference)();
        console.log("AUTO-SAVE: Save result:", result);
        return result;
      }
      return null;
    },
    {
      dedupingInterval: 1000, // Debounce saves by 1 second
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
};
