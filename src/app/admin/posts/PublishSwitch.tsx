"use client";

import { useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { togglePostPublish } from "./actions";
import { toast } from "sonner";

export default function PublishSwitch({ postId, initialPublished }: { postId: string, initialPublished: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      try {
        await togglePostPublish(postId, checked);
        toast.success(checked ? "Artikel dipublikasikan" : "Artikel disimpan sebagai draft");
      } catch (error) {
        toast.error("Gagal mengubah status artikel");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch 
        checked={initialPublished}
        onCheckedChange={handleToggle}
        disabled={isPending}
      />
      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider shadow-sm transition-colors ${initialPublished ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
        {isPending ? "Updating..." : (initialPublished ? "Published" : "Draft")}
      </span>
    </div>
  );
}
