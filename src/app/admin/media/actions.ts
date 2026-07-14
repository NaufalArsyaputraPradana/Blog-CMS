"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import fs from "fs/promises";
import path from "path";

export async function deleteMedia(formData: FormData) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  if (!id) return;

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return;

  // Delete physical file
  try {
    const filename = path.basename(media.url);
    const filepath = path.join(process.cwd(), "public", "uploads", filename);
    await fs.unlink(filepath);
  } catch (error) {
    console.error("Error deleting physical file:", error);
    // Continue deleting from DB even if file is missing
  }

  // Delete from DB
  await prisma.media.delete({
    where: { id }
  });

  revalidatePath("/admin/media");
}
