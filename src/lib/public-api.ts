const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");

export async function publicApi<T>(path: string, locale = "es-MX"): Promise<T> {
  if (!backendUrl) throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured.");
  const separator = path.includes("?") ? "&" : "?";
  const response = await fetch(`${backendUrl}${path}${separator}locale=${encodeURIComponent(locale)}`);
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error?.message ?? "No se pudo obtener el contenido publicado.");
  return body as T;
}
