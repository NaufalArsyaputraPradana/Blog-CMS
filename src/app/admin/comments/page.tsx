import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/DeleteButton";
import { updateCommentStatus, deleteComment } from "./actions";

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: { post: true, author: true }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Komentar</h1>
        <p className="text-zinc-500">Moderasi komentar pengunjung.</p>
      </div>

      <div className="space-y-4">
        {comments.map(c => (
          <Card key={c.id} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="font-semibold">{c.author?.name || c.guestName} <span className="text-zinc-500 font-normal text-sm">di artikel "{c.post.title}"</span></div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{c.content}</p>
                <div className="mt-2 text-xs font-medium px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded inline-block">
                  Status: <span className={c.status === "PENDING" ? "text-amber-500" : c.status === "APPROVED" ? "text-green-500" : "text-red-500"}>{c.status}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {c.status === "PENDING" && (
                  <form action={updateCommentStatus}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="status" value="APPROVED" />
                    <Button type="submit" variant="outline" size="sm" className="text-green-600">Setujui</Button>
                  </form>
                )}
                {c.status !== "SPAM" && (
                  <form action={updateCommentStatus}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="status" value="SPAM" />
                    <Button type="submit" variant="outline" size="sm" className="text-amber-600">Tandai Spam</Button>
                  </form>
                )}
                <DeleteButton id={c.id} action={deleteComment} title="komentar ini" />
              </div>
            </CardContent>
          </Card>
        ))}
        {comments.length === 0 && (
          <div className="py-12 text-center text-zinc-500 border-2 border-dashed rounded-xl">
            Belum ada komentar.
          </div>
        )}
      </div>
    </div>
  );
}
