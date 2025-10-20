// Prefer env base; else rely on Vite proxy at "/api"
const RAW_BASE = (import.meta as any)?.env?.VITE_API_BASE as string | undefined;
const BASE = (RAW_BASE ? RAW_BASE.replace(/\/$/, "") : "/api") as string;

/* ========= Auth header helpers ========= */
function getToken(): string | undefined {
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    undefined
  );
}
function authHeaderObj(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

/* ========= Header utilities ========= */
function toObject(h?: HeadersInit): Record<string, string> {
  if (!h) return {};
  if (h instanceof Headers) {
    const o: Record<string, string> = {};
    h.forEach((v, k) => (o[k] = v));
    return o;
  }
  if (Array.isArray(h)) {
    const o: Record<string, string> = {};
    for (const [k, v] of h) o[k] = String(v);
    return o;
  }
  return { ...(h as Record<string, string>) };
}
function mergeHeaders(a?: HeadersInit, b?: HeadersInit): Record<string, string> {
  return { ...toObject(a), ...toObject(b) };
}

/* ========= Core HTTP ========= */
async function http<T>(url: string, init: RequestInit = {}): Promise<T> {
  const isForm = init.body instanceof FormData;
  const defaultHeaders: Record<string, string> = isForm ? {} : { "Content-Type": "application/json" };

  const headers: Record<string, string> = mergeHeaders(
    mergeHeaders(defaultHeaders, init.headers),
    authHeaderObj()
  );

  let res: Response;
  try {
    res = await fetch(`${BASE}${url}`, { ...init, headers });
  } catch {
    throw new Error("Network error: server unreachable. Check API process and BASE/proxy.");
  }

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/* ========= Public API ========= */
export const API = {
  // --- Auth ---
  register: <T = unknown>(body: { email: string; password: string }): Promise<T> =>
    http<T>("/v1/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: <T = { access_token: string }>(body: { email: string; password: string }): Promise<T> =>
    http<T>("/v1/auth/login", { method: "POST", body: JSON.stringify(body) }),

  me: <T = unknown>(): Promise<T> =>
    http<T>("/v1/auth/me", { method: "GET" }),

  // --- Startup pitch upload (matches backend: /api/v1/match/pitch) ---
recommendPitchFile: async <T>(fd: FormData): Promise<T> => {
  const url = `${BASE}/v1/match/pitch`;
  const res = await fetch(url, { method: "POST", body: fd, headers: authHeaderObj() });
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json() as Promise<T>;
},
};
