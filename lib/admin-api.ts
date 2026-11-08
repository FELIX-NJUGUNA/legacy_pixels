// CLIENT helper for calling /api/admin/* with consistent error handling.
export async function adminFetch<T = any>(
  url: string,
  method: string = "GET",
  body?: unknown
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((json as any).error ?? `Request failed (${res.status})`);
  return json as T;
}