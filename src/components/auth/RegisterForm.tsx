"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function RegisterForm({ 
  asModal = false,
  onSwitchToLogin,
  onSuccess
}: { 
  asModal?: boolean;
  onSwitchToLogin?: () => void;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Akun berhasil dibuat! Mengalihkan...");
        
        // Auto-login
        const signInRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (signInRes?.error) {
          toast.error("Gagal login otomatis, silakan login manual.");
          if (asModal && onSwitchToLogin) {
            onSwitchToLogin();
          } else {
            router.push("/");
          }
        } else {
          toast.success("Berhasil masuk!");
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/admin");
          }
        }
      } else {
        toast.error(data.message || "Gagal mendaftar");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mendaftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`w-full ${asModal ? 'border-none shadow-none bg-transparent' : 'max-w-sm'}`}>
      <CardHeader>
        <CardTitle className="text-2xl">Daftar Penulis</CardTitle>
        <CardDescription>
          Buat akun untuk mulai berkontribusi artikel.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="johndoe@blog.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimal 6 karakter"
              required
              minLength={6}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pb-6">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Memproses..." : "Daftar"}
          </Button>
          <div className="mt-4 text-center text-sm text-zinc-500">
            Sudah punya akun?{" "}
            {asModal && onSwitchToLogin ? (
              <button type="button" onClick={onSwitchToLogin} className="text-blue-600 hover:underline font-medium bg-transparent border-none p-0 cursor-pointer">
                Login di sini
              </button>
            ) : (
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Login di sini
              </Link>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
