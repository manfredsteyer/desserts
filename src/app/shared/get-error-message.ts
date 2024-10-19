export function getErrorMessage(error: unknown) {
  if (!error) {
    return error;
  }
  if (typeof error === 'object' && 'message' in error) {
    return error.message;
  }
  return '' + error;
}
