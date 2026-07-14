import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DeleteButton from "@/components/DeleteButton";
import { createCategory, deleteCategory, deleteTag } from "./actions";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" }
  });

  const tags = await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kategori & Tag</h1>
        <p className="text-zinc-500">Kelola pengelompokan artikel Anda.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle>Tambah Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createCategory} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Kategori</Label>
                  <Input id="name" name="name" required placeholder="Contoh: Teknologi" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Input id="description" name="description" placeholder="Opsional" />
                </div>
                <Button type="submit">Tambah Kategori</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle>Daftar Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {categories.map(c => (
                  <li key={c.id} className="flex justify-between items-center p-3 border rounded-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                    <div>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-xs text-zinc-500">/{c.slug} • {c._count.posts} artikel</div>
                    </div>
                    <DeleteButton id={c.id} action={deleteCategory} title={`kategori "${c.name}"`} />
                  </li>
                ))}
                {categories.length === 0 && <p className="text-zinc-500">Belum ada kategori.</p>}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle>Daftar Tag</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tags.map(t => (
                  <li key={t.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-xs text-zinc-500">/{t.slug} • {t._count.posts} artikel</div>
                    </div>
                    <DeleteButton id={t.id} action={deleteTag} title={`tag "${t.name}"`} />
                  </li>
                ))}
                {tags.length === 0 && <p className="text-zinc-500 text-sm">Tag akan terbuat otomatis saat Anda menambahkannya di artikel.</p>}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
