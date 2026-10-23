import { describe, it, expect } from "vitest";
import { validateDiscussion, validateReply } from "@/lib/validation";
import { homeHref, safeNext } from "@/lib/url";

const valid = { title: "Un titre assez long", content: "Contenu", category: "bourse", type: "question" };

describe("Validation d'une discussion (miroir de Strapi)", () => {
  it("accepte une discussion valide", () => {
    expect(validateDiscussion(valid)).toEqual({});
  });

  it("exige un titre d'au moins 10 caractères (espaces ignorés)", () => {
    expect(validateDiscussion({ ...valid, title: "court" }).title).toMatch(/au moins 10/);
    expect(validateDiscussion({ ...valid, title: "          " }).title).toBeDefined();
    expect(validateDiscussion({ ...valid, title: "1234567890" }).title).toBeUndefined();
  });

  it("exige un contenu, une catégorie et un type valide", () => {
    const errors = validateDiscussion({ title: valid.title, content: "  ", category: "", type: "autre" });
    expect(Object.keys(errors).sort()).toEqual(["category", "content", "type"]);
  });

  it("refuse une réponse vide", () => {
    expect(validateReply("  ").content).toBeDefined();
    expect(validateReply("Merci !")).toEqual({});
  });
});

describe("URLs", () => {
  it("omet les valeurs par défaut pour garder des URLs propres", () => {
    expect(homeHref({})).toBe("/");
    expect(homeHref({ category: "bourse", sort: "createdAt:desc", page: 1 })).toBe("/?category=bourse");
    expect(homeHref({ category: "bourse", sort: "createdAt:asc", q: "etf", page: 2 })).toBe(
      "/?category=bourse&sort=createdAt%3Aasc&q=etf&page=2",
    );
  });

  it("bloque les redirections externes (open redirect)", () => {
    expect(safeNext("/discussions/new")).toBe("/discussions/new");
    expect(safeNext("https://evil.com")).toBe("/");
    expect(safeNext("//evil.com")).toBe("/");
    expect(safeNext(undefined)).toBe("/");
  });
});
