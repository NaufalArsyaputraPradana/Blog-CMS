import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import CommentForm from "@/components/CommentForm";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return {};
  
  return {
    title: `${post.title} - Blog CMS`,
    description: post.excerpt || post.title,
    openGraph: {
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({ where: { published: true }, select: { slug: true } });
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { 
      author: true, 
      category: true, 
      tags: true,
      comments: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        include: { author: true }
      }
    },
  });

  const relatedPosts = await prisma.post.findMany({
    where: {
      published: true,
      id: { not: post?.id },
      categoryId: post?.categoryId
    },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { category: true }
  });

  if (!post) {
    notFound();
  }

  try {
    await prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } }
    });
  } catch (error) {
    console.error("Failed to increment viewCount", error);
  }

  // Jika artikel belum di-publish, hanya admin (yang sedang login) yang boleh melihatnya
  if (!post.published && !session?.user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-10">
            <div>
          {session?.user ? (
            <Link href="/admin" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              &larr; Kembali ke Dashboard
            </Link>
          ) : (
            <Link href="/blog" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              &larr; Kembali ke Artikel
            </Link>
          )}
        </div>
        <article>
          <header className="mb-12 text-center space-y-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-500/10 dark:bg-violet-500/10 blur-[100px] rounded-full -z-10"></div>
            <div className="flex items-center justify-center gap-3 text-sm text-zinc-500 font-medium">
              {post.category && <Link href={`/category/${post.category.slug}`} className="text-blue-600 hover:underline">{post.category.name}</Link>}
              <span>•</span>
              <span>{format(new Date(post.createdAt), "dd MMMM yyyy")}</span>
              <span>•</span>
              <span>{post.viewCount + 1} tayangan</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1] text-balance">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/50 dark:to-violet-900/50 rounded-full flex items-center justify-center font-bold text-blue-700 dark:text-blue-300 shadow-sm border border-white/50 dark:border-zinc-800">
                {post.author.name?.[0] || 'A'}
              </div>
              <div className="text-left text-sm">
                <p className="font-semibold text-zinc-900 dark:text-zinc-50 text-base">{post.author.name}</p>
                <p className="text-zinc-500">Penulis</p>
              </div>
            </div>
          </header>

          {post.featuredImage && (
            <div className="relative mb-16">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-violet-500/20 blur-2xl rounded-3xl -z-10 translate-y-4 scale-95 opacity-70"></div>
              <div className="aspect-video relative rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-100 dark:bg-zinc-900">
                <Image src={post.featuredImage} alt={post.title} fill className="object-cover" priority />
              </div>
            </div>
          )}

          <div 
            className="prose prose-lg dark:prose-invert prose-blue mx-auto"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t flex flex-wrap gap-2">
              <span className="text-sm font-medium text-zinc-500 mr-2 flex items-center">Tags:</span>
              {post.tags.map(tag => (
                <Link key={tag.id} href={`/tag/${tag.slug}`} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 text-sm font-medium rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
        </article>

        <section className="border-t pt-12 space-y-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Komentar ({post.comments.length})</h2>
            
            <div className="space-y-6 mb-10">
              {post.comments.map(comment => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-zinc-500">
                    {(comment.author?.name || comment.guestName)?.[0] || 'U'}
                  </div>
                  <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl rounded-tl-none">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{comment.author?.name || comment.guestName}</span>
                      <span className="text-xs text-zinc-500">{format(new Date(comment.createdAt), "dd MMM yyyy, HH:mm")}</span>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300">{comment.content}</p>
                  </div>
                </div>
              ))}
              {post.comments.length === 0 && (
                <p className="text-zinc-500 italic">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
              )}
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border shadow-sm">
              <CommentForm postId={post.id} isAuthed={!!session?.user} />
            </div>
          </div>
        </section>
      </div>
          
          <aside className="lg:col-span-1 space-y-8 sticky top-24 hidden lg:block">
            <div className="bg-white/50 dark:bg-zinc-900/50 rounded-3xl p-6 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm shadow-sm">
              <h3 className="font-bold text-lg mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">Artikel Terkait</h3>
              {relatedPosts.length > 0 ? (
                <div className="space-y-6">
                  {relatedPosts.map(rp => (
                    <Link key={rp.id} href={`/blog/${rp.slug}`} className="group flex gap-4 items-start">
                      {rp.featuredImage ? (
                        <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0">
                          <Image src={rp.featuredImage} alt={rp.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                          <span className="text-zinc-400 text-xs text-center p-1">No Image</span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-sm leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-3">{rp.title}</h4>
                        <div className="text-xs text-zinc-500 mt-2">{format(new Date(rp.createdAt), "dd MMM yyyy")}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">Tidak ada artikel terkait di kategori ini.</p>
              )}
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-violet-600 dark:from-blue-900/20 dark:to-violet-900/20 rounded-3xl p-8 text-white dark:text-blue-50 shadow-xl text-center dark:border dark:border-blue-800/30">
              <h3 className="font-bold text-xl mb-3">Suka dengan tulisan ini?</h3>
              <p className="text-blue-100 dark:text-blue-200/70 text-sm mb-6">Bagikan artikel ini ke teman-temanmu agar mereka juga mendapatkan informasinya!</p>
              <button className="w-full py-3 bg-white dark:bg-blue-600 text-blue-600 dark:text-white rounded-xl font-bold text-sm hover:scale-105 transition-transform active:scale-95 shadow-sm">
                Bagikan Artikel
              </button>
            </div>
          </aside>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
