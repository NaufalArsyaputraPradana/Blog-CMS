export default function PublicFooter() {
  return (
    <footer className="border-t py-12 bg-white dark:bg-zinc-950 mt-auto">
      <div className="w-full px-6 md:px-12 text-center text-zinc-500 text-sm">
        &copy; {new Date().getFullYear()} Blog CMS. Dibuat dengan Next.js.
      </div>
    </footer>
  );
}
