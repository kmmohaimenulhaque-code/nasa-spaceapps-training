/**
 * Tiny API helper.
 *
 * Because vite.config.js proxies "/api" to FastAPI,
 * we can use relative URLs like "/api/neos" from the browser.
 */

export async function fetchNeos(startDate, endDate) {
  const params = new URLSearchParams();
  if (startDate) params.set("start_date", startDate);
  if (endDate) params.set("end_date", endDate);

  const query = params.toString();
  const url = query ? `/api/neos?${query}` : "/api/neos";

  const response = await fetch(url);
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body?.detail) message = body.detail;
    } catch {
      // ignore JSON parse errors; keep the default message
    }
    throw new Error(message);
  }
  return response.json();
}
