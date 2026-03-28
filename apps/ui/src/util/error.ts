// source: https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
function isErrorWithMessage(error: unknown): error is Error {
  return (
    error instanceof Error ||
    (typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as Record<string, unknown>).message === 'string')
  );
}

export function toErrorWithMessage(maybeError: unknown): Error {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message;
}

/**
 * Simple result utility to treat errors as data rather than exceptions
 * - supports type-safe control flows
 * - supports user visibilty when errors occur and reasons why
 * - avoids unhandled errors at runtime
 */
export type Result<T, E = Error> =
  | { success: true; status: number; payload: T; error?: never }
  | { success: false; status: number; payload?: never; error: E };

/**
 * Helper: success result
 * Forces inclusion of status code and payload (T)
 */
export const ok = <T>(payload: T, status: number = 200): Result<T, never> => ({
  success: true,
  status,
  payload,
});

/**
 * Helper: failure result
 * Forces inclusion of status code and error (E)
 */
export const err = <E>(error: E, status: number = 500): Result<never, E> => ({
  success: false,
  status,
  error,
});

/**
 * Type guard for narrowing Result in filters or loops
 */
export const isSuccess = <T, E>(
  result: Result<T, E>,
): result is { success: true; status: number; payload: T } => {
  return result.success;
};
