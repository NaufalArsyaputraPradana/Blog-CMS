import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import SearchComponent from "./SearchComponent";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Blog CMS - Semua Artikel",
  description: "Daftar semua artikel yang dipublikasikan.",
};

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function BlogListPage({ searchParams }: PageProps) {
  const { q, page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const take = 9;
  const skip = (currentPage - 1) * take;

  const whereCondition: any = { published: true };
  if (q) {
    whereCondition.OR = [
      { title: { contains: q } },
      { content: { contains: q } },
    ];
  }

  const [posts, totalPosts] = await Promise.all([
    prisma.post.findMany({
      where: whereCondition,
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      category: true,
    },
    take,
    skip,
  }),
  prisma.post.count({ where: whereCondition }),
]);

const totalPages = Math.ceil(totalPosts / take);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="mb-12 flex flex-col md:flex-row gap-6 md:items-end justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">Semua Artikel</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-lg">Temukan bacaan terbaru yang memperluas wawasan Anda.</p>
          </div>
          <SearchComponent />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Card key={post.id} className="group overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-zinc-200/50 dark:border-zinc-800/50 flex flex-col h-full">
              <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                {post.featuredImage && (
                  <div className="aspect-[16/10] relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                    <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <CardHeader className="space-y-3 pb-3 flex-none mt-2">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                    {post.category && <span className="text-blue-600 font-bold bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">{post.category.name}</span>}
                    <span>•</span>
                    <span>{format(new Date(post.createdAt), "dd MMM yyyy")}</span>
                  </div>
                  <CardTitle className="text-xl leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-4">
                  <p className="text-zinc-600 dark:text-zinc-400 line-clamp-3 text-sm leading-relaxed">
                    {post.excerpt || post.content.substring(0, 150).replace(/<[^>]+>/g, '') + "..."}
                  </p>
                </CardContent>
                <CardFooter className="border-t border-zinc-100 dark:border-zinc-800/50 pt-4 pb-4 mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/50 dark:to-violet-900/50 flex items-center justify-center font-bold text-xs text-blue-700 dark:text-blue-300 border border-white/50 dark:border-zinc-800 shrink-0">
                      {post.author?.name?.[0] || 'A'}
                    </div>
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">{post.author?.name || 'Anonim'}</span>
                  </div>
                </CardFooter>
              </Link>
            </Card>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full py-24 text-center text-zinc-500 bg-zinc-100 dark:bg-zinc-900 rounded-2xl">
              {q ? `Tidak ada artikel yang cocok dengan "${q}".` : "Belum ada artikel."}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            {currentPage > 1 && (
              <Link href={`/blog?page=${currentPage - 1}${q ? `&q=${q}` : ''}`}>
                <Button variant="outline">Sebelumnnya</Button>
              </Link>
            )}
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Halaman {currentPage} dari {totalPages}
            </span>
            {currentPage < totalPages && (
              <Link href={`/blog?page=${currentPage + 1}${q ? `&q=${q}` : ''}`}>
                <Button variant="outline">Selanjutnya</Button>
              </Link>
            )}
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
