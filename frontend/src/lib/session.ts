import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { strapi } from "./strapi";
import type { CurrentUser } from "./types";

export const TOKEN_COOKIE = "lr_token";
const SEVEN_DAYS = 60 * 60 * 24 * 7;

/** Le JWT est stocké dans un cookie httpOnly : illisible par le JavaScript du navigateur (anti-XSS). */
export async function setSessionToken(token: string) {
  const store = await cookies();
  store.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SEVEN_DAYS,
  });
}

export async function clearSessionToken() {
  (await cookies()).delete(TOKEN_COOKIE);
}

export async function getSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(TOKEN_COOKIE)?.value;
}

/** Utilisateur courant. `cache` déduplique l'appel Strapi au sein d'un même rendu. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = await getSessionToken();
  if (!token) return null;
  return strapi.getMe(token);
});
