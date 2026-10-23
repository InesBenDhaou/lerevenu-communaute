import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { getCurrentUser } from "@/lib/session";
import { firstParam, safeNext } from "@/lib/url";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const next = safeNext(firstParam((await searchParams).next));
  if (await getCurrentUser()) redirect(next);

  return (
    <main className="mx-auto max-w-md space-y-5">
      <header>
        <h1 className="font-display text-3xl font-bold">Connexion</h1>
        <p className="mt-1 text-sm text-ink-3">Connectez-vous pour publier et répondre.</p>
      </header>
      <LoginForm next={next} />
    </main>
  );
}
