import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import UploadForm from "./UploadForm";
import DeleteButton from "@/components/DeleteButton";
import { deleteMedia } from "./actions";

export default async function MediaPage() {
  const session = await auth();
  
  if (!session) return null;

  const mediaFiles = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    include: { uploader: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Kelola file gambar untuk artikel Anda.
          </p>
        </div>
        <UploadForm />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mediaFiles.map((media) => (
          <Card key={media.id} className="overflow-hidden group">
            <CardContent className="p-0 aspect-square relative bg-zinc-100 dark:bg-zinc-800">
              {media.mimetype.startsWith("image/") ? (
                <Image
                  src={media.url}
                  alt={media.filename}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-zinc-400 text-xs">
                  {media.filename}
                </div>
              )}
              {/* Overlay with Delete Button */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <DeleteButton id={media.id} action={deleteMedia} title="media ini" />
              </div>
            </CardContent>
          </Card>
        ))}
        {mediaFiles.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500 border-2 border-dashed rounded-xl">
            Belum ada file media.
          </div>
        )}
      </div>
    </div>
  );
}
