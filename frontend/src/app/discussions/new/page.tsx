import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DiscussionForm } from "@/components/DiscussionForm";
import { getCurrentUser } from "@/lib/session";
import { strapi } from "@/lib/strapi";
import { firstParam } from "@/lib/url";

export const metadata: Metadata = { title: "Nouvelle discussion" };

export default async function NewDiscussionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/discussions/new");

  const params = await searchParams;
  const categories = await strapi.getCategories();

  return (
    <main className="mx-auto max-w-2xl space-y-5">
      <header>
        <h1 className="font-display text-3xl font-bold">Nouvelle publication</h1>
        <p className="mt-1 text-sm text-ink-3">
          Publiée en tant que <strong className="text-ink">{user.username}</strong>.
        </p>
      </header>
      <DiscussionForm categories={categories} defaultCategory={firstParam(params.category)} />
    </main>
  );
}
