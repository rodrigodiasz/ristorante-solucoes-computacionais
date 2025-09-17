import { getCookie } from "cookies-next";

export async function getCookieClient() {
  const token = getCookie("session");
  return token || null;
}
