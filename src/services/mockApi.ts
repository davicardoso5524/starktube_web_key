// mockApi.ts
// Fake service to handle key generation with local rate limiting

export interface GenerateKeyResult {
  success: boolean;
  key?: string;
  error?: string;
  nextAvailableAt?: string;
}

export const mockApi = {
  generateKey: async (machineCode: string): Promise<GenerateKeyResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const now = Date.now();
          const limitKey = 'ytdl_last_issued_at';
          const lastIssued = localStorage.getItem(limitKey);

          // Simulate 1 key per day logic
          if (lastIssued) {
            const lastDate = parseInt(lastIssued, 10);
            const oneDay = 24 * 60 * 60 * 1000;
            
            if (now - lastDate < oneDay) {
              const nextAvailable = new Date(lastDate + oneDay);
              return resolve({
                success: false,
                error: 'LIMIT_REACHED',
                nextAvailableAt: nextAvailable.toLocaleString('pt-BR', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })
              });
            }
          }

          // Connect to actual API backend instead of generating local mock payloads
          fetch('/api/api-licenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ machineCode, validityDays: 30 })
          })
          .then(res => res.json().then(data => ({ ok: res.ok, data })))
          .then(({ ok, data }) => {
             if (ok && data.licenseKey) {
                localStorage.setItem(limitKey, now.toString());
                resolve({ success: true, key: data.licenseKey });
             } else {
                resolve({ success: false, error: data.error || 'SERVER_ERROR' });
             }
          })
          .catch(err => {
             resolve({ success: false, error: 'SERVER_ERROR' });
          });

        } catch (err) {
          resolve({ success: false, error: 'SERVER_ERROR' });
        }
      }, 500); // reduced delay as fetch will take some time organically
    });
  }
};
