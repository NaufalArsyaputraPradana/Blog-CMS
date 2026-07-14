"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteUser } from "./actions";

export default function DeleteUserButton({ userId, userName }: { userId: string, userName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Peringatan: Menghapus penulis "${userName}" juga akan MENGHAPUS SEMUA ARTIKEL, komentar, dan media yang pernah mereka buat secara permanen. Anda yakin?`)) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteUser(userId);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Pengguna berhasil dihapus.");
    }
    setIsDeleting(false);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
      title="Hapus Pengguna"
    >
      <Trash2 className="size-4" />
      <span className="sr-only">Hapus Pengguna</span>
    </Button>
  );
}
