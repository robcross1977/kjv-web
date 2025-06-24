import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";

/**
 * Represents a Bible reference in normalized format
 */
export interface LastReference {
  /** The reference string (e.g., "John 3:16", "Genesis 1:1-10") */
  reference: string;
  /** When this reference was last accessed */
  lastAccessed: Date;
}

/**
 * API request to update user's last reference
 */
export interface UpdateLastReferenceRequest {
  reference: string;
}

/**
 * API response for last reference operations
 */
export interface LastReferenceResponse {
  success: boolean;
  lastReference: string | null;
  message?: string;
}

/**
 * Errors that can occur during last reference operations
 */
export type LastReferenceError =
  | "USER_NOT_AUTHENTICATED"
  | "INVALID_REFERENCE"
  | "DATABASE_ERROR"
  | "NETWORK_ERROR";

/**
 * Result types for last reference operations using fp-ts
 */
export type LastReferenceResult = E.Either<LastReferenceError, string>;
export type OptionalLastReference = O.Option<string>;

/**
 * Hook state for managing last reference
 */
export interface UseLastReferenceState {
  lastReference: OptionalLastReference;
  isLoading: boolean;
  error: O.Option<LastReferenceError>;
  hasFetched: boolean;
}

/**
 * Hook actions for last reference management
 */
export interface UseLastReferenceActions {
  updateLastReference: (reference: string) => Promise<LastReferenceResult>;
  clearLastReference: () => Promise<LastReferenceResult>;
  refreshLastReference: () => Promise<void>;
}
