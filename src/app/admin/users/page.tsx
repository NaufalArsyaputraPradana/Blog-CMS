import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DeleteUserButton from "./DeleteUserButton";

export const metadata = {
  title: "Manajemen Penulis - Admin CMS",
};

export default async function UsersPage() {
  const session = await auth();

  if ((session?.user as any)?.role !== "SUPERADMIN") {
    redirect("/admin");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { posts: true, comments: true, media: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Penulis</h1>
        <p className="text-zinc-500 mt-2">Kelola akun dan hak akses para penulis di blog Anda.</p>
      </div>

      <Card className="border-zinc-200/50 dark:border-zinc-800/50 shadow-sm bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>
            Menampilkan total {users.length} pengguna terdaftar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-500 uppercase bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200/50 dark:border-zinc-800/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Pengguna</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Statistik</th>
                  <th className="px-6 py-4 font-medium">Bergabung Pada</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">{user.name}</div>
                      <div className="text-zinc-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === "SUPERADMIN" ? (
                        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-100 border-purple-200">
                          Superadmin
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
                          Penulis
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-500">
                      <div className="flex flex-col gap-1 text-xs">
                        <span>{user._count.posts} Artikel</span>
                        <span>{user._count.comments} Komentar</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">
                      {format(new Date(user.createdAt), "dd MMM yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== "SUPERADMIN" && (
                        <DeleteUserButton userId={user.id} userName={user.name || user.email} />
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                      Belum ada pengguna terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
