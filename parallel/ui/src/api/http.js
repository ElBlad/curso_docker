const API_BASE_URL = import.meta.env.API_BASE_URL;

async function request(
  path,
  { method = "GET", body, headers = {}, ...options } = {},
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method,
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  console.log(response.url, response.status);

  if (!response.ok) {
    let message = await response.text();
    if (response.headers.get("content-type")?.includes("application/json")) {
      const payload = JSON.parse(message);
      if (payload && typeof payload === "object") {
        message = payload.error ?? payload.message ?? message;
      }
    }
    console.error(message || `Request failed with status ${response.status}`);
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const http = {
  get: (path, options) => request(path, options),
  post: (path, body, options) =>
    request(path, { ...options, method: "POST", body }),
  put: (path, body, options) =>
    request(path, { ...options, method: "PUT", body }),
  patch: (path, body, options) =>
    request(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};
