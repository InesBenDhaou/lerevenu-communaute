import { DiscussionCard } from "./DiscussionCard";
import { EmptyState } from "./EmptyState";
import type { DiscussionSummary } from "@/lib/types";

export function DiscussionList({
  discussions,
  isFiltered = false,
}: {
  discussions: DiscussionSummary[];
  isFiltered?: boolean;
}) {
  if (discussions.length === 0) {
    return isFiltered ? (
      <EmptyState
        title="Aucune discussion trouvée"
        description="Essayez une autre catégorie ou un autre mot-clé."
        actionHref="/"
        actionLabel="Réinitialiser les filtres"
      />
    ) : (
      <EmptyState
        title="Soyez le premier à lancer une discussion"
        description="La communauté démarre ici : posez une question ou partagez votre expérience."
        actionHref="/discussions/new"
        actionLabel="Publier"
      />
    );
  }

  return (
    <ul className="space-y-3" aria-label="Discussions">
      {discussions.map((discussion) => (
        <li key={discussion.id}>
          <DiscussionCard discussion={discussion} />
        </li>
      ))}
    </ul>
  );
}
