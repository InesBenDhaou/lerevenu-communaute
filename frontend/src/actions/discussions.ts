"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { strapi, StrapiError } from "@/lib/strapi";
import { getSessionToken } from "@/lib/session";
import { validateDiscussion, validateReply } from "@/lib/validation";
import type { DiscussionType, FieldErrors } from "@/lib/types";

export type DiscussionFormState = {
  fieldErrors?: FieldErrors;
  message?: string;
  values?: { title: string; content: string; category: string; type: string };
};

export type ReplyFormState = {
  ok?: boolean;
  fieldErrors?: FieldErrors;
  message?: string;
  content?: string;
};

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "");

function errorMessage(error: StrapiError) {
  if (error.status === 401 || error.status === 403) {
    return "Votre session a expiré ou vous n'avez pas le droit de publier. Reconnectez-vous.";
  }
  return error.message;
}

export async function createDiscussionAction(
  _prev: DiscussionFormState,
  formData: FormData,
): Promise<DiscussionFormState> {
  const token = await getSessionToken();
  if (!token) redirect("/login?next=/discussions/new");

  const values = {
    title: text(formData, "title"),
    content: text(formData, "content"),
    category: text(formData, "category"),
    type: text(formData, "type"),
  };

  const fieldErrors = validateDiscussion(values);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };

  let slug: string;
  try {
    const created = await strapi.createDiscussion(token, {
      ...values,
      type: values.type as DiscussionType,
    });
    slug = created.slug;
  } catch (error) {
    if (error instanceof StrapiError) {
      return {
        fieldErrors: error.fieldErrors,
        message: Object.keys(error.fieldErrors).length ? undefined : errorMessage(error),
        values,
      };
    }
    throw error;
  }

  revalidatePath("/");
  redirect(`/discussions/${slug}`);
}

export async function createReplyAction(
  _prev: ReplyFormState,
  formData: FormData,
): Promise<ReplyFormState> {
  const token = await getSessionToken();
  if (!token) redirect("/login");

  const content = text(formData, "content");
  const discussionId = text(formData, "discussionId");
  const slug = text(formData, "slug");

  const fieldErrors = validateReply(content);
  if (Object.keys(fieldErrors).length) return { fieldErrors, content };

  try {
    await strapi.createReply(token, { content, discussion: discussionId });
  } catch (error) {
    if (error instanceof StrapiError) {
      return { fieldErrors: error.fieldErrors, message: errorMessage(error), content };
    }
    throw error;
  }

  revalidatePath(`/discussions/${slug}`);
  revalidatePath("/");
  return { ok: true };
}
