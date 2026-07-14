import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { format } from "date-fns";
import DeleteButton from "@/components/DeleteButton";
import { deletePost } from "./actions";
import PublishSwitch from "./PublishSwitch";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      category: true,
      tags: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artikel</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Kelola semua artikel blog Anda.
          </p>
        </div>
        <Link href="/admin/posts/new" className={buttonVariants()}>
          Tulis Artikel
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm border-zinc-200/50 dark:border-zinc-800/50">
            {post.featuredImage && (
              <div className="aspect-[16/9] relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200/50 dark:border-zinc-800/50 shrink-0">
                <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 p-1.5 rounded-full shadow-sm border border-zinc-200/50 dark:border-zinc-700/50">
                  <PublishSwitch postId={post.id} initialPublished={post.published} />
                </div>
              </div>
            )}
            <CardContent className="p-5 flex-1 flex flex-col">
              {!post.featuredImage && (
                <div className="mb-3">
                  <PublishSwitch postId={post.id} initialPublished={post.published} />
                </div>
              )}
              <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-zinc-500 mt-auto pt-4">
                <span>{post.author.name}</span>
                <span>•</span>
                <span>{format(new Date(post.createdAt), "dd MMM yyyy")}</span>
              </div>
            </CardContent>
            <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50 flex gap-2 justify-end mt-auto shrink-0">
              <Link href={`/admin/posts/${post.id}`} className={buttonVariants({ variant: "secondary", size: "sm", className: "rounded-full px-4 hover:scale-105 transition-transform shadow-sm" })}>
                Lihat
              </Link>
              <Link href={`/admin/posts/${post.id}/edit`} className={buttonVariants({ variant: "outline", size: "sm", className: "rounded-full px-4 hover:scale-105 transition-transform shadow-sm bg-white dark:bg-zinc-950" })}>
                Edit
              </Link>
              <DeleteButton id={post.id} action={deletePost} title={`artikel "${post.title}"`} />
            </div>
          </Card>
        ))}
        
        {posts.length === 0 && (
          <div className="py-12 text-center text-zinc-500 border-2 border-dashed rounded-xl">
            Belum ada artikel. Klik "Tulis Artikel" untuk mulai.
          </div>
        )}
      </div>
    </div>
  );
}
