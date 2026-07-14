"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, FolderTree, Image as ImageIcon, MessageSquare, Users, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Artikel", href: "/admin/posts", icon: FileText },
  { name: "Kategori & Tag", href: "/admin/categories", icon: FolderTree },
  { name: "Komentar", href: "/admin/comments", icon: MessageSquare },
  { name: "Media", href: "/admin/media", icon: ImageIcon },
  { name: "Profil Saya", href: "/admin/profile", icon: UserCircle },
  { name: "Manajemen Penulis", href: "/admin/users", icon: Users, requireRole: "SUPERADMIN" },
];

export default function AdminNav({ role }: { role?: string }) {
  const pathname = usePathname();

  const filteredNavItems = navItems.filter(
    (item) => !item.requireRole || item.requireRole === role
  );

  return (
    <nav className="flex flex-row md:flex-col gap-2 p-3 md:p-4 text-sm font-medium">
      {filteredNavItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 md:gap-3 rounded-xl px-3 py-2 md:px-4 md:py-3 transition-all duration-200 group active:scale-[0.98] whitespace-nowrap",
              isActive 
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-50"
            )}
          >
            <item.icon className={cn("size-4 md:size-5 shrink-0 transition-transform duration-200", !isActive && "group-hover:scale-110")} />
            <span className="font-medium md:font-semibold">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
