"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteButtonProps {
  id: string;
  action: (formData: FormData) => Promise<void>;
  title?: string;
}

export default function DeleteButton({ id, action, title }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", id);
      await action(formData);
      toast.success(`Berhasil menghapus ${title || 'data'}!`);
      setOpen(false);
    } catch (error) {
      toast.error("Gagal menghapus data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger 
        render={
          <Button variant="destructive" size="sm" className="gap-1 flex items-center shadow-sm hover:-translate-y-0.5 transition-transform rounded-full px-4">
            <Trash2 className="size-3.5" />
            Hapus
          </Button>
        } 
      />
      <AlertDialogContent className="glass-morphism">
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Data?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak bisa dibatalkan. Apakah Anda yakin ingin menghapus {title || 'data ini'} secara permanen dari server?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            {loading ? "Menghapus..." : "Ya, Hapus Permanen"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
