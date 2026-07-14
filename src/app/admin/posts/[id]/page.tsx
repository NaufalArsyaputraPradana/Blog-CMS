import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";

export default async function AdminPostViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      category: true,
      tags: true,
    }
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/posts" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="size-4" />
          Kembali ke Daftar Artikel
        </Link>
        <Link href={`/admin/posts/${post.id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>
          <Edit className="size-4 mr-2" />
          Edit Artikel
        </Link>
      </div>

      <Card className="overflow-hidden">
        {post.featuredImage && (
          <div className="aspect-video relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-b">
            <Image src={post.featuredImage} alt={post.title} fill className="object-cover" priority />
          </div>
        )}
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Badge variant={post.published ? "default" : "secondary"} className={post.published ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400" : ""}>
                {post.published ? "Published" : "Draft"}
              </Badge>
              {post.category && (
                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
                  {post.category.name}
                </Badge>
              )}
            </div>
            <div className="text-sm text-zinc-500">
              Dibuat pada {format(new Date(post.createdAt), "dd MMM yyyy, HH:mm")}
            </div>
          </div>
          <CardTitle className="text-3xl md:text-4xl font-extrabold leading-tight">
            {post.title}
          </CardTitle>
          <div className="text-sm text-zinc-500 flex items-center gap-2">
            <span>Oleh <span className="font-medium text-zinc-900 dark:text-zinc-100">{post.author.name}</span></span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-zinc dark:prose-invert max-w-none prose-img:rounded-xl prose-a:text-blue-600" dangerouslySetInnerHTML={{ __html: post.content }} />
          
          {post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t flex flex-wrap gap-2">
              <span className="text-sm font-medium text-zinc-500 mr-2 flex items-center">Tags:</span>
              {post.tags.map(tag => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
