// Base URL, error type, and the single fetch wrapper every endpoint goes through.
// Override the base URL in .env with VITE_API_BASE_URL (see .env.example).

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const DEFAULT_TIMEOUT_MS = 15000;

export const buildUrl = (path, params) => {
  const url = new URL(
    path.startsWith("/") ? path : `/${path}`,
    `${API_BASE_URL}/`
  );

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

export class ApiError extends Error {
  constructor(message, { status = null, code = "api_error", details = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isNetwork() {
    return this.code === "network_error";
  }

  get isTimeout() {
    return this.code === "timeout";
  }
}

// Turns a DRF error payload ({detail} or {field: [msg]}) into one readable line.
const messageFromPayload = (payload, fallback) => {
  if (!payload || typeof payload !== "object") return fallback;
  if (typeof payload.detail === "string") return payload.detail;

  const first = Object.values(payload).flat().find((v) => typeof v === "string");
  return first ?? fallback;
};

const parseBody = async (response) => {
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return response.text().catch(() => null);
  }
  return response.json().catch(() => null);
};

/**
 * Builds the URL, applies a timeout, and turns any failure into an ApiError.
 *
 * @param {string} path      e.g. "/api/posts/"
 * @param {object} [options]
 * @param {string} [options.method="GET"]
 * @param {object} [options.params] query string values
 * @param {unknown} [options.body] JSON-serialised automatically
 * @param {AbortSignal} [options.signal] caller's cancellation (e.g. React cleanup)
 * @returns {Promise<any>} the parsed response body
 */
export const request = async (
  path,
  { method = "GET", params, body, headers, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = {}
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(new Error("timeout")), timeoutMs);

  // Abort if either the caller cancels or we time out.
  const onCallerAbort = () => controller.abort(signal.reason);
  signal?.addEventListener("abort", onCallerAbort);

  let response;
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    if (signal?.aborted) throw error; // caller cancelled — let React discard it
    if (error.name === "AbortError") {
      throw new ApiError("The request took too long. Please try again.", {
        code: "timeout",
      });
    }
    throw new ApiError(
      "Could not reach the server. Check your connection and try again.",
      { code: "network_error" }
    );
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener("abort", onCallerAbort);
  }

  const payload = await parseBody(response);

  if (!response.ok) {
    throw new ApiError(
      messageFromPayload(payload, `Request failed (${response.status})`),
      { status: response.status, code: "http_error", details: payload }
    );
  }

  return payload;
};

export const get = (path, options) => request(path, { ...options, method: "GET" });
export const post = (path, body, options) =>
  request(path, { ...options, method: "POST", body });
