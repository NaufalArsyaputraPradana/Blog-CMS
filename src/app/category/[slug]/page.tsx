import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  
  return {
    title: `Kategori: ${category.name} - Blog CMS`,
    description: category.description || `Semua artikel dalam kategori ${category.name}`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          category: true, // we already know the category, but keep it for consistency
        }
      }
    }
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white/80 backdrop-blur-md dark:bg-zinc-950/80 px-6 max-w-6xl w-full mx-auto">
        <Link href="/" className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">
          Blog<span className="text-blue-600">.</span>CMS
        </Link>
        <Link href="/blog" className="ml-8 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
          &larr; Semua Artikel
        </Link>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <p className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wider">Kategori</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">{category.name}</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-lg">
            {category.description || `Ditemukan ${category.posts.length} artikel dalam kategori ini.`}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.posts.map(post => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
              <Link href={`/blog/${post.slug}`}>
                {post.featuredImage && (
                  <div className="aspect-video relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
                  </div>
                )}
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                    <span className="text-blue-600">{category.name}</span>
                    <span>•</span>
                    <span>{format(new Date(post.createdAt), "dd MMM yyyy")}</span>
                  </div>
                  <CardTitle className="text-xl leading-tight line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400 line-clamp-3 text-sm">
                    {post.excerpt || post.content.substring(0, 150).replace(/<[^>]+>/g, '') + "..."}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
          {category.posts.length === 0 && (
            <div className="col-span-full py-24 text-center text-zinc-500 bg-zinc-100 dark:bg-zinc-900 rounded-2xl">
              Belum ada artikel untuk kategori ini.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
