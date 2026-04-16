import { generateKeyPairSync } from 'crypto';

console.log('Gerando chaves Ed25519...');

const { publicKey, privateKey } = generateKeyPairSync('ed25519');

const privateKeyB64 = privateKey.export({
  type: 'pkcs8',
  format: 'der'
}).toString('base64');

const publicKeyB64 = publicKey.export({
  type: 'spki',
  format: 'der'
}).toString('base64');

console.log('\n--- VARIÁVEIS DE AMBIENTE (Copie para o .env do Site) ---');
console.log(`LICENSE_PRIVATE_KEY_B64=${privateKeyB64}`);
console.log(`LICENSE_PUBLIC_KEY_B64=${publicKeyB64}`);

console.log('\n--- CHAVE PÚBLICA PARA O APP DESKTOP (TypeScript) ---');
console.log(`export const LICENSE_PUBLIC_KEY = '${publicKeyB64}';`);
console.log('\nAtenção: A chave privada DEVE ficar apenas no servidor web onde as licenças são emitidas!');
