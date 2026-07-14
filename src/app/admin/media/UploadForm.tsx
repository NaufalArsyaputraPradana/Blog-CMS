"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";

import { toast } from "sonner";

export default function UploadForm() {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        toast.success("Media berhasil diunggah!");
        router.refresh();
      } else {
        toast.error("Gagal mengunggah media.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengunggah.");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleUpload}
        accept="image/*"
        disabled={uploading}
      />
      <label 
        htmlFor="file-upload" 
        className={buttonVariants({ className: "cursor-pointer" }) + (uploading ? " opacity-50 pointer-events-none" : "")}
      >
        {uploading ? "Uploading..." : "Upload Media"}
      </label>
    </div>
  );
}
