import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./ProfileClient";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, image: true, role: true }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Kelola informasi pribadi dan pengaturan akun Anda.
        </p>
      </div>
      
      <ProfileClient user={user} />
    </div>
  );
}
