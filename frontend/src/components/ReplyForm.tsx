"use client";

import { useActionState, useEffect, useRef } from "react";
import { createReplyAction, type ReplyFormState } from "@/actions/discussions";
import { FieldError } from "./FieldError";
import { SubmitButton } from "./SubmitButton";

export function ReplyForm({ discussionId, slug }: { discussionId: string; slug: string }) {
  const [state, formAction] = useActionState<ReplyFormState, FormData>(createReplyAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  // Après une publication réussie, on vide le champ.
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} noValidate className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <input type="hidden" name="discussionId" value={discussionId} />
      <input type="hidden" name="slug" value={slug} />

      <label htmlFor="reply-content" className="font-display text-lg font-bold">
        Votre réponse
      </label>
      <textarea
        id="reply-content"
        name="content"
        rows={4}
        defaultValue={state.content}
        placeholder="Partagez votre expérience ou votre conseil…"
        aria-invalid={Boolean(state.fieldErrors?.content)}
        aria-describedby="reply-error"
        className="mt-2 w-full rounded-xl border border-line bg-canvas p-3 text-[15px] outline-none focus:border-brand"
      />
      <FieldError id="reply-error" message={state.fieldErrors?.content} />

      {state.message && !state.fieldErrors?.content && (
        <p role="alert" className="mt-2 text-sm font-medium text-brand-text">{state.message}</p>
      )}
      {state.ok && (
        <p role="status" className="mt-2 text-sm font-medium text-ok">Votre réponse a été publiée.</p>
      )}

      <div className="mt-3 flex justify-end">
        <SubmitButton pendingLabel="Publication…">Publier la réponse</SubmitButton>
      </div>
    </form>
  );
}
