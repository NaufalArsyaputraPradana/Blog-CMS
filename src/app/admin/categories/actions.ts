"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const slug = slugify(name, { lower: true, strict: true });

  if (!name) return;

  await prisma.category.create({
    data: { name, slug, description },
  });
  revalidatePath("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.category.delete({
    where: { id }
  });
  revalidatePath("/admin/categories");
}

export async function deleteTag(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.tag.delete({
    where: { id }
  });
  revalidatePath("/admin/categories");
}
