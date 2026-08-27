/**
 * Extracts a readable message from a caught error.
 *
 * Supabase client errors (PostgrestError, StorageError, AuthError, etc.) are
 * plain objects with a `message` property -- they are NOT `instanceof Error`.
 * Code that only checked `error instanceof Error` was silently discarding the
 * real Supabase error and showing a generic "An unknown error occurred."
 * instead, everywhere a Supabase call failed. This helper handles both cases.
 */
export function getErrorMessage(error: unknown, fallback = 'An unknown error occurred.'): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }
  return fallback;
}
