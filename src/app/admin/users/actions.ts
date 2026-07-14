"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function isSuperAdmin() {
  const session = await auth();
  return session?.user?.role === "SUPERADMIN";
}

export async function deleteUser(userId: string) {
  if (!(await isSuperAdmin())) {
    return { error: "Unauthorized. Hanya Superadmin yang dapat menghapus pengguna." };
  }

  try {
    // Periksa apakah pengguna yang akan dihapus adalah superadmin
    const userToVerify = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, email: true }
    });

    if (!userToVerify) {
      return { error: "Pengguna tidak ditemukan." };
    }

    if (userToVerify.role === "SUPERADMIN") {
      return { error: "Tidak dapat menghapus akun Superadmin." };
    }

    // Karena relasi bisa jadi mencegah penghapusan jika ada post/komentar/media,
    // Kita harus memastikan onDelete: Cascade di prisma, atau menghapus datanya terlebih dahulu.
    // Dalam kasus ini kita hapus data terkait pengguna tersebut terlebih dahulu secara manual jika schema tidak cascade.
    
    // Hapus semua media
    await prisma.media.deleteMany({ where: { uploaderId: userId } });
    
    // Hapus semua komentar yang dibuat oleh user
    await prisma.comment.deleteMany({ where: { authorId: userId } });
    
    // Hapus post user beserta relasi komentarnya (butuh pendekatan khusus)
    const userPosts = await prisma.post.findMany({ where: { authorId: userId }, select: { id: true } });
    const postIds = userPosts.map(p => p.id);
    
    if (postIds.length > 0) {
      await prisma.comment.deleteMany({ where: { postId: { in: postIds } } });
      await prisma.post.deleteMany({ where: { authorId: userId } });
    }

    // Akhirnya, hapus user
    await prisma.user.delete({
      where: { id: userId }
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Delete user error:", error);
    return { error: error.message || "Gagal menghapus pengguna." };
  }
}
