export default function AdminLoading() {
  return (
    <div className="space-y-6 w-full max-w-5xl animate-pulse">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-md w-48"></div>
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-72"></div>
        </div>
        <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-md w-32"></div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/50 dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
              <div className="w-4 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
            </div>
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
          </div>
        ))}
      </div>
      
      <div className="h-96 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-xl mt-8"></div>
    </div>
  );
}
