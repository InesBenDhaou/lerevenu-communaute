"use client";

import { useActionState, useRef } from "react";
import { loginAction, type LoginState } from "@/actions/auth";
import { SubmitButton } from "./SubmitButton";

const DEMO_ACCOUNTS = [
  { label: "Alice", email: "alice@demo.test" },
  { label: "Bob", email: "bob@demo.test" },
  { label: "Claire", email: "claire@demo.test" },
];
const DEMO_PASSWORD = "Demo1234!";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, {});
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const fill = (email: string) => {
    if (emailRef.current) emailRef.current.value = email;
    if (passwordRef.current) passwordRef.current.value = DEMO_PASSWORD;
  };

  return (
    <div className="space-y-5">
      <form action={formAction} className="space-y-4 rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <input type="hidden" name="next" value={next ?? "/"} />

        {state.error && (
          <p role="alert" className="rounded-xl bg-brand-soft p-3 text-sm font-medium text-brand-text">
            {state.error}
          </p>
        )}

        <div>
          <label htmlFor="identifier" className="text-sm font-semibold">E-mail</label>
          <input
            ref={emailRef}
            id="identifier"
            name="identifier"
            type="email"
            autoComplete="username"
            defaultValue={state.identifier}
            required
            className="mt-1.5 w-full rounded-xl border border-line px-3.5 py-2.5 outline-none focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-semibold">Mot de passe</label>
          <input
            ref={passwordRef}
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1.5 w-full rounded-xl border border-line px-3.5 py-2.5 outline-none focus:border-brand"
          />
        </div>
        <SubmitButton pendingLabel="Connexion…">Se connecter</SubmitButton>
      </form>

      <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-4 text-sm">
        <p className="font-semibold">Comptes de démonstration</p>
        <p className="mt-1 text-ink-3">
          Mot de passe commun : <code className="rounded bg-surface-2 px-1.5 py-0.5">{DEMO_PASSWORD}</code>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => fill(account.email)}
              className="rounded-full border border-line px-3.5 py-1.5 font-medium hover:bg-surface-2"
            >
              Remplir avec {account.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
