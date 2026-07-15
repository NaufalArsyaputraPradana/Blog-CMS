import { ReactNode } from "react";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import AdminNav from "@/components/AdminNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  
  // Middleware handles actual Edge protection, but we keep this for TypeScript type narrowing
  if (!session) {
    redirect("/");
  }


  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-col">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-200/50 bg-white/70 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/70 px-6 w-full shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50 hover:scale-105 transition-transform origin-left">
            Dasbor<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-500">.</span>Admin
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hidden sm:block">
            {session.user?.name || session.user?.email}
          </span>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button variant="outline" size="sm" type="submit" className="rounded-full px-4 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors">
              Logout
            </Button>
          </form>
        </div>
      </header>
      <div className="flex flex-col md:flex-row flex-1 w-full overflow-hidden">
        <aside className="w-full md:w-64 border-b md:border-r border-zinc-200/50 bg-white/50 dark:border-zinc-800/50 dark:bg-zinc-950/50 shrink-0 overflow-x-auto md:overflow-y-auto">
          <AdminNav role={(session.user as any)?.role as string} />
        </aside>
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
