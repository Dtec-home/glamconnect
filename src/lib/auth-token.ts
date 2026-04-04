const TOKEN_KEY = "wacu_token";

export function setAuthToken(token: string) {
  if (globalThis.window === undefined) {
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
}

export function getAuthToken() {
  if (globalThis.window === undefined) {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthToken() {
  if (globalThis.window === undefined) {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
}
