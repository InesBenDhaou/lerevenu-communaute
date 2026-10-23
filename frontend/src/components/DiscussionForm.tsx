"use client";

import { useActionState, useState } from "react";
import { createDiscussionAction, type DiscussionFormState } from "@/actions/discussions";
import { FieldError } from "./FieldError";
import { SubmitButton } from "./SubmitButton";
import { TITLE_MIN } from "@/lib/validation";
import type { Category } from "@/lib/types";

const input =
  "mt-1.5 w-full rounded-xl border bg-surface px-3.5 py-2.5 text-[15px] outline-none focus:border-brand";

export function DiscussionForm({
  categories,
  defaultCategory,
}: {
  categories: Category[];
  defaultCategory?: string;
}) {
  const [state, formAction] = useActionState<DiscussionFormState, FormData>(createDiscussionAction, {});
  const errors = state.fieldErrors ?? {};
  const [titleLength, setTitleLength] = useState(state.values?.title.trim().length ?? 0);
  const type = state.values?.type ?? "question";

  return (
    <form action={formAction} noValidate className="space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-6">
      {state.message && (
        <p role="alert" className="rounded-xl bg-brand-soft p-3 text-sm font-medium text-brand-text">
          {state.message}
        </p>
      )}

      <fieldset>
        <legend className="text-sm font-semibold">Type de publication</legend>
        <div className="mt-1.5 grid grid-cols-2 gap-2">
          {[
            { value: "question", label: "Question", hint: "J'attends des réponses" },
            { value: "discussion", label: "Discussion", hint: "J'ouvre un échange" },
          ].map((option) => (
            <label key={option.value} className="cursor-pointer">
              <input
                type="radio"
                name="type"
                value={option.value}
                defaultChecked={type === option.value}
                className="peer sr-only"
              />
              <span className="block rounded-xl border border-line p-3 text-sm transition peer-checked:border-brand peer-checked:bg-brand-soft peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-brand">
                <span className="block font-semibold">{option.label}</span>
                <span className="text-xs text-ink-3">{option.hint}</span>
              </span>
            </label>
          ))}
        </div>
        <FieldError id="type-error" message={errors.type} />
      </fieldset>

      <div>
        <label htmlFor="title" className="text-sm font-semibold">Titre</label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={state.values?.title}
          onChange={(event) => setTitleLength(event.target.value.trim().length)}
          placeholder="Ex. PEA ou assurance-vie pour un ETF World ?"
          aria-invalid={Boolean(errors.title)}
          aria-describedby="title-hint title-error"
          maxLength={200}
          className={`${input} ${errors.title ? "border-brand" : "border-line"}`}
        />
        <p id="title-hint" className={`mt-1 text-xs ${titleLength >= TITLE_MIN ? "text-ok" : "text-ink-3"}`}>
          {titleLength}/{TITLE_MIN} caractères minimum
        </p>
        <FieldError id="title-error" message={errors.title} />
      </div>

      <div>
        <label htmlFor="category" className="text-sm font-semibold">Catégorie</label>
        <select
          id="category"
          name="category"
          defaultValue={state.values?.category ?? defaultCategory ?? ""}
          aria-invalid={Boolean(errors.category)}
          aria-describedby="category-error"
          className={`${input} ${errors.category ? "border-brand" : "border-line"}`}
        >
          <option value="" disabled>Choisir un espace…</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>{category.name}</option>
          ))}
        </select>
        <FieldError id="category-error" message={errors.category} />
      </div>

      <div>
        <label htmlFor="content" className="text-sm font-semibold">Contenu</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          defaultValue={state.values?.content}
          placeholder="Détaillez votre situation, vos objectifs, ce que vous avez déjà essayé…"
          aria-invalid={Boolean(errors.content)}
          aria-describedby="content-error"
          className={`${input} ${errors.content ? "border-brand" : "border-line"}`}
        />
        <FieldError id="content-error" message={errors.content} />
      </div>

      <div className="flex justify-end">
        <SubmitButton pendingLabel="Publication…">Publier</SubmitButton>
      </div>
    </form>
  );
}
