"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/AppShell';
import { 
  KeyRequestForm, 
  KeyResultCard, 
  DailyLimitAlert, 
  StatusBanner 
} from '@/components/PublicComponents';
import { mockApi } from '@/services/mockApi';

export default function PublicKeyGenerator() {
  const [view, setView] = useState<'form' | 'success' | 'limit'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [generatedKey, setGeneratedKey] = useState('');
  const [nextAvailable, setNextAvailable] = useState('');

  const handleGenerate = async (machineCode: string) => {
    setLoading(true);
    setError(null);

    const result = await mockApi.generateKey(machineCode);
    
    setLoading(false);

    if (result.success && result.key) {
      setGeneratedKey(result.key);
      setView('success');
    } else if (result.error === 'LIMIT_REACHED') {
      setNextAvailable(result.nextAvailableAt || '');
      setView('limit');
    } else {
      setError("Erro inesperado no servidor. Tente novamente mais tarde.");
    }
  };

  const handleReset = () => {
    setView('form');
    setError(null);
  };

  return (
    <AppShell>
      <div className="w-full max-w-md mx-auto space-y-8">
        
        {/* Branding header in the content area */}
        {view === 'form' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <h1 className="text-3xl font-extrabold tracking-tight">Emissor de Licenças</h1>
            <p className="text-muted-foreground text-sm">
              Gere sua chave gratuita para o Stark Tube. 
              <br />Limitado a <strong>1 emissão por dia</strong>.
            </p>
          </motion.div>
        )}

        <div className="relative">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <StatusBanner type="error" message={error} />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            layout
            className="bg-card border border-border/60 shadow-2xl rounded-2xl p-6 sm:p-8"
          >
            <AnimatePresence mode="wait">
              {view === 'form' && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <KeyRequestForm 
                    isLoading={loading} 
                    onSubmit={handleGenerate} 
                  />
                </motion.div>
              )}

              {view === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <KeyResultCard 
                    licenseKey={generatedKey} 
                    onReset={handleReset} 
                  />
                </motion.div>
              )}

              {view === 'limit' && (
                <motion.div
                  key="limit"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <DailyLimitAlert 
                    nextAvailableAt={nextAvailable} 
                    onReset={handleReset} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
