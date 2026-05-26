const AUTH_STORAGE_KEY = "shipease_auth";

const API_BASE_CANDIDATES = [
  import.meta.env.VITE_API_URL,
  "http://localhost:5000/api",
  "/api",
].filter(Boolean);

export function saveAuthSession(session) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function getAuthSession() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function apiRequest(path, options = {}) {
  let lastNetworkError = null;
  let lastApiError = null;

  for (const baseUrl of API_BASE_CANDIDATES) {
    let response;

    try {
      response = await fetch(`${baseUrl}${path}`, {
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });
    } catch (error) {
      lastNetworkError = error;
      continue;
    }

    const payload = await response.json().catch(() => null);

    if (response.ok) {
      return payload;
    }

    const message =
      payload?.error ||
      payload?.message ||
      (payload?.details && JSON.stringify(payload.details)) ||
      `Request failed (${response.status})`;

    // If this base path simply doesn't exist, try next candidate.
    if (response.status === 404) {
      lastApiError = new Error(message);
      continue;
    }

    throw new Error(message);
  }

  if (lastNetworkError) {
    throw new Error(
      "Unable to reach backend. Start backend on port 5000 and try again."
    );
  }

  throw lastApiError || new Error("Request failed");
}
