import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditPostForm from "./EditPostForm";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { tags: true }
  });

  if (!post) {
    notFound();
  }

  // format tags as comma separated string
  const tagsString = post.tags.map(t => t.name).join(", ");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Artikel</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Perbarui artikel Anda di sini.
        </p>
      </div>

      <EditPostForm post={post} initialTags={tagsString} />
    </div>
  );
}
