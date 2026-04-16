"use client";

import { useEffect, useState } from "react";
import { LogOut, Users, Key, MonitorSmartphone, AlertCircle, Ban, Copy, Check } from "lucide-react";
import { cn } from "@/components/PublicComponents";

interface LicenseRecord {
  id: string;
  machineCode: string;
  product: string;
  version: number;
  exp: number;
  revoked: boolean;
  licenseKey: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Manual generation state
  const [mcInput, setMcInput] = useState("");
  const [genLoading, setGenLoading] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.href = "/";
  };

  const loadLicenses = async () => {
    try {
      const res = await fetch("/api/api-licenses");
      if (res.ok) {
        setLicenses(await res.json());
      } else if (res.status === 401) {
        window.location.href = "/admin/login";
      }
    } catch {
      console.error("Erro ao carregar licenças");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLicenses();
  }, []);

  const handleRevoke = async (id: string) => {
    if (!confirm("Tem certeza que deseja revogar permanentemente?")) return;
    try {
      await fetch(`/api/api-licenses/${id}/revoke`, { method: 'POST' });
      loadLicenses();
    } catch {
      alert("Falha ao revogar");
    }
  };

  const handleCopy = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mcInput.trim()) return;
    
    setGenLoading(true);
    try {
      const res = await fetch("/api/api-licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ machineCode: mcInput, validityDays: 30 })
      });
      if (res.ok) {
        setMcInput('');
        loadLicenses();
      } else {
        const err = await res.json();
        alert(`Erro: ${err.error || 'Falha ao gerar'}`);
      }
    } catch {
      alert("Erro de comunicação com o servidor.");
    } finally {
      setGenLoading(false);
    }
  };

  const getStatus = (revoked: boolean, exp: number) => {
    if (revoked) return <span className="bg-destructive/20 text-destructive-foreground px-2 py-0.5 rounded text-xs font-bold border border-destructive/30">Revogada</span>;
    if ((Date.now() / 1000) > exp) return <span className="bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded text-xs font-bold border border-yellow-500/30">Expirada</span>;
    return <span className="bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded text-xs font-bold border border-emerald-500/30">Ativa</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="font-bold text-foreground">Admin <span className="text-primary">Panel</span></h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sair <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-muted-foreground text-sm font-medium flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" /> Total Emitidas
            </h3>
            <p className="text-3xl font-bold mt-2">{licenses.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-muted-foreground text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Ativas (30 dias)
            </h3>
            <p className="text-3xl font-bold mt-2">
              {licenses.filter(l => !l.revoked && (Date.now() / 1000) < l.exp).length}
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-10">
          <h2 className="font-semibold mb-4">Emissão Direta de Key (Admin)</h2>
          <form onSubmit={handleGenerate} className="flex gap-4">
             <input
               type="text"
               required
               value={mcInput}
               onChange={e => setMcInput(e.target.value)}
               placeholder="Machine Code..."
               disabled={genLoading}
               className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-foreground font-mono focus:outline-none focus:border-primary uppercase disabled:opacity-50"
             />
             <button
               type="submit"
               disabled={genLoading}
               className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
             >
               {genLoading ? "Gerando..." : "Gerar Key"}
             </button>
          </form>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/20">
             <h2 className="font-semibold">Log de Licenças</h2>
          </div>
          
          {loading ? (
             <div className="p-12 text-center text-muted-foreground flex justify-center">
                 <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-muted/10 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-muted-foreground">Status</th>
                    <th className="px-6 py-3 font-semibold text-muted-foreground">Machine Code</th>
                    <th className="px-6 py-3 font-semibold text-muted-foreground">Expiração</th>
                    <th className="px-6 py-3 font-semibold text-muted-foreground">Emissão</th>
                    <th className="px-6 py-3 font-semibold text-muted-foreground text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {licenses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                         Nenhuma chave gerada até o momento.
                      </td>
                    </tr>
                  ) : null}
                  {licenses.map(lic => (
                    <tr key={lic.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">{getStatus(lic.revoked, lic.exp)}</td>
                      <td className="px-6 py-4 font-mono text-muted-foreground flex items-center gap-2">
                         <MonitorSmartphone className="w-3.5 h-3.5 opacity-50" /> {lic.machineCode}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(lic.exp * 1000).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(lic.createdAt).toLocaleString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleCopy(lic.id, lic.licenseKey)}
                            className="p-1.5 bg-muted/50 text-foreground rounded border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Copiar Key"
                          >
                            {copiedId === lic.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => handleRevoke(lic.id)}
                            disabled={lic.revoked}
                            className="p-1.5 bg-destructive/10 text-destructive-foreground rounded border border-destructive/20 hover:bg-destructive hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Revogar"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
