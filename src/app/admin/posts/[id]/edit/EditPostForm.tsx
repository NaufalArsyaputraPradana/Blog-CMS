"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Editor from "@/components/Editor";
import { updatePost } from "../../actions";

export default function EditPostForm({ post, initialTags }: { post: any, initialTags: string }) {
  const [content, setContent] = useState(post.content || "");
  const [loading, setLoading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(post.featuredImage || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();

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
        setFeaturedImage(data.url);
        toast.success("Gambar berhasil diunggah!");
      } else {
        toast.error("Gagal mengunggah gambar");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengunggah gambar");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("content", content);

    try {
      const res = await updatePost(post.id, formData);
      if (res.success) {
        toast.success("Perubahan artikel berhasil disimpan!");
        router.push("/admin/posts");
        router.refresh();
      } else {
        toast.error("Gagal menyimpan perubahan");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menyimpan artikel");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Artikel</Label>
                <Input id="title" name="title" defaultValue={post.title} required className="text-lg font-semibold" />
              </div>
              
              <div className="space-y-2">
                <Label>Konten</Label>
                <Editor content={content} onChange={setContent} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pengaturan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Gambar Utama (Featured Image)</Label>
                <input type="hidden" name="featuredImage" value={featuredImage} />
                {featuredImage ? (
                  <div className="relative aspect-video rounded-md overflow-hidden bg-zinc-100 border">
                    <img src={featuredImage} alt="Featured" className="object-cover w-full h-full" />
                    <button 
                      type="button" 
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow"
                      onClick={() => setFeaturedImage("")}
                    >Hapus</button>
                  </div>
                ) : (
                  <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                )}
                {uploadingImage && <p className="text-xs text-zinc-500">Mengunggah...</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Kutipan Singkat (Excerpt)</Label>
                <Input id="excerpt" name="excerpt" defaultValue={post.excerpt} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tag (Pisahkan dengan koma)</Label>
                <Input id="tags" name="tags" defaultValue={initialTags} />
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="published" name="published" defaultChecked={post.published} className="rounded border-zinc-300" />
                <Label htmlFor="published">Langsung Publikasikan</Label>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>
    </form>
  );
}
