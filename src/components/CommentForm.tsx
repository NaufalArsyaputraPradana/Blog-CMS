"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";

export default function CommentForm({ postId, isAuthed }: { postId: string, isAuthed: boolean }) {
  const [content, setContent] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, content, guestName, guestEmail })
    });

    setLoading(false);
    if (res.ok) {
      toast.success("Komentar berhasil dikirim!");
      setContent("");
      setGuestName("");
      setGuestEmail("");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold">Tinggalkan Komentar</h3>
      {!isAuthed && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input id="name" required value={guestName} onChange={e => setGuestName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="content">Komentar</Label>
        <textarea 
          id="content"
          required
          rows={4}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Mengirim..." : "Kirim Komentar"}
      </Button>
    </form>
  );
}
