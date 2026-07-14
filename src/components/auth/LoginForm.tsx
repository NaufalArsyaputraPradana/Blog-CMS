"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm({ 
  asModal = false, 
  onSwitchToRegister,
  onSuccess
}: { 
  asModal?: boolean;
  onSwitchToRegister?: () => void;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email atau password salah");
      setLoading(false);
    } else {
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin");
      }
      if (asModal) {
        // Soft refresh for modal context
        router.refresh();
      }
    }
  };

  return (
    <Card className={`w-full ${asModal ? 'border-none shadow-none bg-transparent' : 'max-w-sm'}`}>
      <CardHeader>
        <CardTitle className="text-2xl">Login Admin</CardTitle>
        <CardDescription>
          Masukkan email dan password untuk masuk ke dashboard.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@blog.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="admin123"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pb-6">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </Button>
          <div className="mt-4 text-center text-sm text-zinc-500">
            Belum punya akun?{" "}
            {asModal && onSwitchToRegister ? (
              <button type="button" onClick={onSwitchToRegister} className="text-blue-600 hover:underline font-medium bg-transparent border-none p-0 cursor-pointer">
                Daftar di sini
              </button>
            ) : (
              <Link href="/register" className="text-blue-600 hover:underline font-medium">
                Daftar di sini
              </Link>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
