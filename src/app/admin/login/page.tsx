"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyIcon } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Fake login to simulate cookie setting / fake admin route access bypass
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        alert("Senha incorreta.");
      }
    } catch {
      alert("Erro na comunicação com o servidor");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-primary/30">
      <div className="w-full max-w-sm p-8 bg-card border border-border rounded-xl shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
             <KeyIcon className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Admin Login</h1>
          <p className="text-muted-foreground text-sm mt-1">Acesso exclusivo</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-all text-center"
            placeholder="Email..."
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-all text-center"
            placeholder="Senha..."
          />
          <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-lg font-medium transition-colors">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
