import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { AuthModal } from "@/components/auth/AuthModal";

export const metadata = {
  title: "Blog CMS - Home",
  description: "Platform blogging modern dengan Next.js",
};

export default async function HomePage() {
  const latestPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      author: true,
      category: true,
    },
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-16 relative">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        {/* Hero Section */}
        <section className="relative py-12 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl xl:text-7xl leading-[1.1]">
                Menulis Menjadi Lebih <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-500">Menyenangkan</span>
              </h1>
              <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto lg:mx-0">
                Temukan berbagai artikel menarik seputar teknologi, web development, dan pengalaman seru lainnya di platform kami. Desain elegan, performa super cepat.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link href="/blog" className={buttonVariants({ size: "lg" })}>
                  Mulai Membaca
                </Link>
                <AuthModal triggerText="Bergabung Menulis" triggerSize="lg" defaultView="register" />
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none aspect-square">
              <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
              <Image 
                src="/hero-illustration.png" 
                alt="Blogging Illustration" 
                fill 
                className="object-contain relative z-10"
                priority
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 border-y border-zinc-200 dark:border-zinc-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto md:mx-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold">Performa Kilat</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Dibangun dengan Next.js App Router, memberikan pengalaman membaca yang sangat cepat tanpa waktu tunggu.</p>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto md:mx-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-xl font-bold">Aman Terlindungi</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Sistem keamanan tingkat tinggi, menjaga privasi setiap artikel dan komentar dengan peran berlapis.</p>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto md:mx-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
              </div>
              <h3 className="text-xl font-bold">Desain Modern</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Tampilan *Glassmorphism* dan dukungan *Dark Mode* asli yang memanjakan mata Anda berlama-lama.</p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Artikel Terbaru</h2>
            <Link href="/blog" className="text-blue-600 font-medium hover:underline">Lihat Semua &rarr;</Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map(post => (
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
            {latestPosts.length === 0 && (
              <div className="col-span-full py-24 text-center text-zinc-500 bg-zinc-100 dark:bg-zinc-900 rounded-2xl">
                Belum ada artikel yang dipublikasikan.
              </div>
            )}
          </div>
        </section>
      </main>
      
      <PublicFooter />
    </div>
  );
}
