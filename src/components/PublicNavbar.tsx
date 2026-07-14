import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthModal } from "@/components/auth/AuthModal";
import { auth, signOut } from "@/auth";

export default async function PublicNavbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-zinc-200/50 bg-white/70 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/70 px-6 md:px-12 w-full transition-all duration-300">
      <Link href="/" className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50 hover:scale-105 transition-transform duration-200 origin-left">
        Blog<span className="text-blue-600">.</span>CMS
      </Link>
      <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
        <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Artikel</Link>
        {session ? (
          <div className="flex items-center gap-2">
            <Link href="/admin" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Dashboard
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                Logout
              </button>
            </form>
          </div>
        ) : (
          <AuthModal />
        )}
        <ThemeToggle />
      </nav>
    </header>
  );
}
