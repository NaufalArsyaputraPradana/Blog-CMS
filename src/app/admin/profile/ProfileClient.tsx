"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateProfile } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileClient({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.image || "");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setAvatarUrl(data.url);
        toast.success("Avatar berhasil diunggah!");
      } else {
        toast.error("Gagal mengunggah avatar");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengunggah");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("image", avatarUrl);

    try {
      const res = await updateProfile(formData);
      if (res.success) {
        toast.success("Profil berhasil diperbarui!");
      } else {
        toast.error(res.error || "Gagal memperbarui profil");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 shadow-sm bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Informasi Dasar</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center space-y-4 shrink-0">
              <Avatar className="w-32 h-32 border-4 border-white dark:border-zinc-900 shadow-xl">
                <AvatarImage src={avatarUrl} alt={user.name || "Avatar"} className="object-cover" />
                <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-100 to-violet-100 text-blue-700 dark:from-blue-900 dark:to-violet-900 dark:text-blue-200">
                  {user.name?.[0]?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center">
                <Label htmlFor="avatar-upload" className="cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  {uploadingImage ? "Mengunggah..." : "Ganti Foto"}
                </Label>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
              </div>
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" name="name" defaultValue={user.name || ""} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email} disabled className="bg-zinc-100 dark:bg-zinc-900 text-zinc-500 cursor-not-allowed" />
                <p className="text-xs text-zinc-500">Email tidak dapat diubah.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Peran (Role)</Label>
                <Input id="role" defaultValue={user.role} disabled className="bg-zinc-100 dark:bg-zinc-900 text-zinc-500 cursor-not-allowed" />
              </div>
              
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                <h3 className="font-semibold text-sm">Ganti Password (Opsional)</h3>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input id="newPassword" name="newPassword" type="password" placeholder="Biarkan kosong jika tidak ingin mengubah" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button type="submit" disabled={loading} className="px-8">
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
