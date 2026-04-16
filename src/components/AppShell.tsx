import React from 'react';
import { Key } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/30">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50 shadow-glow-sm">
              <Key className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              Stark <span className="text-primary">Tube</span>
            </span>
          </div>
          <nav>
            {/* Can link to admin if they are staff, but public mostly */}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Stark Tube. Desenvolvido por <strong>Davi Cardoso</strong>.</p>
        <p className="mt-1 opacity-60">Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
