import type { FieldErrors } from "./types";


export const TITLE_MIN = 10;

export function validateDiscussion(input: {
  title: string;
  content: string;
  category: string;
  type: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (input.title.trim().length < TITLE_MIN) {
    errors.title = `Le titre doit contenir au moins ${TITLE_MIN} caractères.`;
  }
  if (!input.content.trim()) errors.content = "Le contenu est obligatoire.";
  if (!input.category) errors.category = "Choisissez une catégorie.";
  if (input.type !== "question" && input.type !== "discussion") {
    errors.type = "Choisissez un type.";
  }
  return errors;
}

export function validateReply(content: string): FieldErrors {
  return content.trim().length < 2 ? { content: "La réponse ne peut pas être vide." } : {};
}
