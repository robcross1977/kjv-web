import { useState, useEffect } from "react";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";

type ReadingProgressData = {
  readVersesCount: number;
  progressPercentage: number;
  userId: string;
};

/**
 * Hook to fetch and manage user's Bible reading progress
 */
export function useReadingProgress() {
  const [data, setData] = useState<ReadingProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    setIsLoading(true);
    setError(null);

    const result = await pipe(
      TE.tryCatch(
        async () => {
          const response = await fetch("/api/user/reading-progress");

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.error || "Failed to fetch reading progress"
            );
          }

          return response.json() as Promise<ReadingProgressData>;
        },
        (error) => `Failed to fetch reading progress: ${String(error)}`
      )
    )();

    setIsLoading(false);

    if (E.isLeft(result)) {
      setError(result.left);
      return;
    }

    setData(result.right);
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchProgress,
  };
}
