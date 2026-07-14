import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <PublicNavbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="mb-12 flex flex-col md:flex-row gap-6 md:items-end justify-between animate-pulse">
          <div className="space-y-4 w-full max-w-md">
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-md w-3/4"></div>
            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-md w-full"></div>
          </div>
          <div className="w-full max-w-md h-10 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="flex flex-col h-full animate-pulse bg-white/50 dark:bg-zinc-900/50">
              <div className="aspect-[16/10] bg-zinc-200 dark:bg-zinc-800 w-full shrink-0"></div>
              <CardHeader className="space-y-3 pb-3 mt-2">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 w-1/3 rounded"></div>
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 w-full rounded"></div>
              </CardHeader>
              <CardContent className="flex-1 space-y-2 pb-4">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 w-full rounded"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 w-full rounded"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 w-2/3 rounded"></div>
              </CardContent>
              <div className="border-t border-zinc-100 dark:border-zinc-800/50 p-4 flex gap-3 items-center mt-auto">
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 w-1/2 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
