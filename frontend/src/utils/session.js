// Everything the app keeps in localStorage for a logged-in user.
const SESSION_KEYS = ["token", "uname", "uemail", "uprofilepic"];

export const clearSession = () => {
  SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
};

// JWT payloads are base64url encoded; atob() needs plain base64.
export const decodeToken = (token) => {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const payload = decodeToken(token);
  if (!payload) return true;
  return payload.exp ? payload.exp * 1000 < Date.now() : false;
};

// Clears the session and sends the user to the login page with a reason
// ("expired" or "weekly") that Login.jsx turns into a message.
export const logoutAndRedirect = (reason = "expired") => {
  clearSession();
  if (!window.location.pathname.startsWith("/login")) {
    window.location.href = `/login?${reason}=true`;
  }
};
