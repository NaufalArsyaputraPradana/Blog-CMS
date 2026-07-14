"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function updateCommentStatus(formData: FormData) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  
  if (!id || !status) return;

  await prisma.comment.update({
    where: { id },
    data: { status }
  });
  revalidatePath("/admin/comments");
}

export async function deleteComment(formData: FormData) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.comment.delete({
    where: { id }
  });
  revalidatePath("/admin/comments");
}
