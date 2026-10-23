"use server";

import { redirect } from "next/navigation";
import { strapi, StrapiError } from "@/lib/strapi";
import { clearSessionToken, setSessionToken } from "@/lib/session";
import { safeNext } from "@/lib/url";

export type LoginState = { error?: string; identifier?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? ""));

  if (!identifier || !password) {
    return { error: "Renseignez votre e-mail et votre mot de passe.", identifier };
  }

  try {
    const { jwt } = await strapi.login(identifier, password);
    await setSessionToken(jwt);
  } catch (error) {
    if (error instanceof StrapiError) {
      return {
        error: error.status === 400 ? "E-mail ou mot de passe incorrect." : error.message,
        identifier,
      };
    }
    throw error;
  }

  redirect(next); 
}

export async function logoutAction() {
  await clearSessionToken();
  redirect("/");
}
