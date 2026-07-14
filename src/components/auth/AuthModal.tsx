"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { buttonVariants } from "@/components/ui/button";

export function AuthModal({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [view, setView] = useState<"login" | "register">("login");

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => setView("login"), 300); // Reset view when closed
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className={buttonVariants({ variant: "outline", size: "sm", className: "hidden sm:inline-flex" })}>
        Login Penulis
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none">
        <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl rounded-xl">
          {view === "login" ? (
            <LoginForm 
              asModal 
              onSwitchToRegister={() => setView("register")}
              onSuccess={() => setOpen(false)}
            />
          ) : (
            <RegisterForm 
              asModal 
              onSwitchToLogin={() => setView("login")}
              onSuccess={() => setOpen(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
