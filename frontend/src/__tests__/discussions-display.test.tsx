import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { DiscussionList } from "@/components/DiscussionList";
import { discussion } from "./fixtures";

describe("Affichage des discussions", () => {
  it("affiche titre, auteur, catégorie, nombre de réponses et date relative", () => {
    render(<DiscussionList discussions={[discussion()]} />);

    const card = screen.getByRole("article");
    expect(within(card).getByRole("link", { name: /PEA ou assurance-vie/ })).toHaveAttribute(
      "href",
      "/discussions/pea-ou-assurance-vie-demo",
    );
    expect(within(card).getByText("alice")).toBeInTheDocument();
    expect(within(card).getByText("Bourse & actions")).toBeInTheDocument();
    expect(within(card).getByText(/3 réponses/)).toBeInTheDocument();
    expect(within(card).getByText("il y a 3 h")).toBeInTheDocument();
    expect(within(card).getByText("Question")).toBeInTheDocument();
  });

  it("accorde « réponse » au singulier", () => {
    render(<DiscussionList discussions={[discussion({ repliesCount: 1 })]} />);
    expect(screen.getByText(/1 réponse$/)).toBeInTheDocument();
  });

  it("affiche une carte par discussion, dans l'ordre reçu de l'API", () => {
    render(
      <DiscussionList
        discussions={[
          discussion({ id: "a", title: "Première discussion de la liste" }),
          discussion({ id: "b", title: "Seconde discussion de la liste" }),
        ]}
      />,
    );
    const titles = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(titles).toEqual(["Première discussion de la liste", "Seconde discussion de la liste"]);
  });

  it("affiche un état vide invitant à publier quand il n'y a aucune discussion", () => {
    render(<DiscussionList discussions={[]} />);
    expect(screen.getByText(/Soyez le premier/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Publier" })).toHaveAttribute("href", "/discussions/new");
  });

  it("affiche un état vide « aucun résultat » quand un filtre ne retourne rien", () => {
    render(<DiscussionList discussions={[]} isFiltered />);
    expect(screen.getByText("Aucune discussion trouvée")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Réinitialiser/ })).toHaveAttribute("href", "/");
  });

  it("n'interprète pas le HTML contenu dans un titre (pas de XSS)", () => {
    const { container } = render(
      <DiscussionList discussions={[discussion({ title: "<img src=x onerror=alert(1)> piège" })]} />,
    );
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText(/<img src=x/)).toBeInTheDocument();
  });
});
