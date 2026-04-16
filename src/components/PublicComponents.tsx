"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle2, AlertTriangle, KeyIcon, Clock } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function StatusBanner({ type, message }: { type: 'error' | 'success' | 'info'; message: string }) {
  const styles = {
    error: "bg-destructive/10 text-destructive-foreground border-destructive/30",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/30"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }}
      className={cn("p-3 rounded-lg border text-sm font-medium flex items-center gap-2", styles[type])}
    >
      {type === 'error' && <AlertTriangle className="w-4 h-4" />}
      {type === 'success' && <CheckCircle2 className="w-4 h-4" />}
      {type === 'info' && <AlertTriangle className="w-4 h-4" />}
      {message}
    </motion.div>
  );
}

export function KeyRequestForm({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (machineCode: string) => void;
  isLoading: boolean;
}) {
  const [machineCode, setMachineCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(machineCode);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1.5">Machine Code (Hardware ID)</label>
        <input
          type="text"
          required
          value={machineCode}
          onChange={e => setMachineCode(e.target.value)}
          placeholder="Ex: AABB-CCDD-1122"
          disabled={isLoading}
          className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/50 disabled:opacity-50 uppercase"
        />
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3" />
          A chave gerada será atrelada a este dispositivo.
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full relative group overflow-hidden rounded-lg bg-primary text-primary-foreground font-semibold py-3 px-4 shadow-glow hover:shadow-[0_0_25px_0_rgba(239,68,68,0.6)] focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span className={cn("inline-flex items-center gap-2", isLoading && "opacity-0")}>
          <KeyIcon className="w-4 h-4" /> Gerar Key
        </span>
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Gerando...
          </span>
        )}
      </button>
    </form>
  );
}

export function KeyResultCard({ licenseKey, onReset }: { licenseKey: string, onReset: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Licença Gerada com Sucesso!</h3>
      </div>

      <div className="bg-background border border-border p-4 rounded-xl relative group">
        <textarea
          readOnly
          value={licenseKey}
          className="w-full h-24 bg-transparent resize-none text-muted-foreground font-mono text-sm focus:outline-none selection:bg-primary/30"
        />
        <button
          onClick={handleCopy}
          className="absolute right-3 bottom-3 bg-muted hover:bg-muted/80 text-foreground text-xs py-1.5 px-3 rounded-md flex items-center gap-1.5 transition-colors border border-border/50"
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copiada!" : "Copiar"}
        </button>
      </div>

      <button
        onClick={onReset}
        className="w-full py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Voltar
      </button>
    </motion.div>
  );
}

export function DailyLimitAlert({ nextAvailableAt, onReset }: { nextAvailableAt: string, onReset: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 py-4"
    >
      <div className="w-16 h-16 bg-muted/50 text-muted-foreground rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
        <Clock className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-foreground">Limite Diário Atingido</h3>
        <p className="text-muted-foreground mb-4">
          Para garantir o acesso justo a todos, permitimos apenas <strong>1 key por dia por usuário</strong>.
        </p>
        <div className="inline-block bg-primary/10 border border-primary/20 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
          Próxima emissão: {nextAvailableAt}
        </div>
      </div>
      
      <div className="pt-4">
        <button
          onClick={onReset}
          className="text-sm text-primary hover:text-primary-hover font-medium underline-offset-4 hover:underline transition-all"
        >
          Voltar ao início
        </button>
      </div>
    </motion.div>
  );
}
