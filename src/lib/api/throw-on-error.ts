export function throwOnError<T>(result: {
  data?: T
  error?: unknown
}): T {
  if (result.error) throw result.error
  return result.data as T
}
