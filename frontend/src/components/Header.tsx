import Link from "next/link";
import { logoutAction } from "@/actions/auth";
import { getCurrentUser } from "@/lib/session";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Communauté Le Revenu, accueil">
          <span className="rounded-md bg-brand px-2 py-1 font-black leading-none tracking-tight text-white">
            Le Revenu
          </span>
          <span className="font-display text-lg font-bold">Communauté</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Navigation principale">
          {user ? (
            <>
              <Link
                href="/discussions/new"
                className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover"
              >
                <span className="hidden sm:inline">Nouvelle discussion</span>
                <span className="sm:hidden">+ Publier</span>
              </Link>
              <span className="hidden items-center gap-2 text-sm text-ink-2 sm:flex">
                <span
                  aria-hidden
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-xs font-bold uppercase text-brand-text"
                >
                  {user.username.slice(0, 2)}
                </span>
                {user.username}
              </span>
              <form action={logoutAction}>
                <button className="rounded-full px-3 py-2 text-sm font-medium text-ink-3 transition hover:bg-surface-2 hover:text-ink">
                  Déconnexion
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              Se connecter
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
