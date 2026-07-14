import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FolderTree, MessageSquare, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const [
    totalPosts,
    totalDrafts,
    totalCategories,
    totalTags,
    totalComments,
    pendingComments,
    totalMedia,
    recentPosts,
    recentComments
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: false } }),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.comment.count(),
    prisma.comment.count({ where: { status: "PENDING" } }),
    prisma.media.count(),
    prisma.post.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { author: true } }),
    prisma.comment.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { post: true, author: true } })
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Selamat datang kembali di panel admin Blog CMS. Berikut adalah ringkasan konten Anda.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Posts Stat */}
        <Link href="/admin/posts" className="group">
          <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
              <FileText className="h-4 w-4 text-zinc-500 group-hover:text-blue-500 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalPosts}</div>
              <p className="text-xs text-zinc-500 mt-1">
                {totalDrafts} draft belum dipublikasikan
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Categories Stat */}
        <Link href="/admin/categories" className="group">
          <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kategori & Tag</CardTitle>
              <FolderTree className="h-4 w-4 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCategories}</div>
              <p className="text-xs text-zinc-500 mt-1">
                Dan {totalTags} tag terdaftar
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Comments Stat */}
        <Link href="/admin/comments" className="group">
          <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Komentar</CardTitle>
              <MessageSquare className="h-4 w-4 text-zinc-500 group-hover:text-amber-500 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalComments}</div>
              <p className="text-xs text-zinc-500 mt-1">
                {pendingComments > 0 ? (
                  <span className="text-amber-600 font-medium">{pendingComments} butuh persetujuan</span>
                ) : (
                  <span>Semua komentar disetujui</span>
                )}
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Media Stat */}
        <Link href="/admin/media" className="group">
          <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Media Library</CardTitle>
              <ImageIcon className="h-4 w-4 text-zinc-500 group-hover:text-purple-500 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalMedia}</div>
              <p className="text-xs text-zinc-500 mt-1">
                File gambar yang diunggah
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-zinc-200/50 dark:border-zinc-800/50 shadow-sm bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Artikel Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPosts.length > 0 ? (
              <div className="space-y-4">
                {recentPosts.map(post => (
                  <div key={post.id} className="flex items-start justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 last:border-0 last:pb-0">
                    <div>
                      <Link href={`/admin/posts/${post.id}`} className="font-medium hover:text-blue-600 transition-colors line-clamp-1">{post.title}</Link>
                      <div className="text-xs text-zinc-500 mt-1">{post.author.name} • {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold shrink-0 ml-4 ${post.published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 text-center py-4">Belum ada artikel.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-zinc-200/50 dark:border-zinc-800/50 shadow-sm bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Komentar Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {recentComments.length > 0 ? (
              <div className="space-y-4">
                {recentComments.map(comment => (
                  <div key={comment.id} className="border-b border-zinc-100 dark:border-zinc-800 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">{comment.author?.name || comment.guestName || 'Anonim'}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${comment.status === 'APPROVED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                        {comment.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 line-clamp-2">{comment.content}</p>
                    <div className="text-[10px] text-zinc-400 mt-2 flex items-center justify-between">
                      <span>Di artikel: <Link href={`/admin/posts/${comment.postId}`} className="hover:underline text-zinc-500">{comment.post.title}</Link></span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 text-center py-4">Belum ada komentar.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
