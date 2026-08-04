const DEFAULT_API_URL = "http://localhost:8080/api";

export function getApiUrl() {
  return (process.env.MAINTENANCE_API_URL ?? DEFAULT_API_URL).replace(/\/$/, "");
}

export const AUTH_COOKIE = "maintenance_access_token";
export const REFRESH_COOKIE = "maintenance_refresh_token";

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};
