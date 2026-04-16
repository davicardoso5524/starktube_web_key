# YTDL License Manager

Este é o painel de administração web do YTDL, responsável por gerar offline licenças criptografadas (Ed25519) para o aplicativo desktop.

Este aplicativo não requer que o desktop valide as licenças online. A emissão provê uma chave pública para o desktop validar o payload exato, assinado digitalmente localmente.

## 🚀 Como rodar o painel localmente

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Gere o par de chaves Ed25519:
   ```bash
   node scripts/generate-keys.mjs
   ```

3. Configure as variáveis de ambiente:
   Edite ou crie o arquivo `.env` na raiz do projeto conforme a saída do script acima.
   ```env
   DATABASE_URL="file:./dev.db"
   ADMIN_PASSWORD="suasenhaforte"
   LICENSE_PRIVATE_KEY_B64="<sua_chave_privada_base64_gerada_pelo_script>"
   LICENSE_PUBLIC_KEY_B64="<sua_chave_publica_base64_gerada_pelo_script>"
   ```
   > ⚠️ **IMPORTANTE**: A sua `LICENSE_PRIVATE_KEY_B64` deve ficar **apenas** aqui no servidor web. Jamais vaze ela no código do Desktop.

4. Crie o banco de dados local SQLite:
   ```bash
   npx prisma db push
   ```

5. Rode a aplicação:
   ```bash
   npm run dev
   ```

Acesse em [http://localhost:3000](http://localhost:3000) e faça login com a sua `ADMIN_PASSWORD`.

## 💿 Como configurar o App Desktop

No código em TypeScript do seu desktop app, você precisará da Chave Pública (revelada quando você rodou `node scripts/generate-keys.mjs`).

```typescript
// Exemplo de como checar uma key no Desktop
import { createPublicKey, verify } from 'crypto';

const LICENSE_PUBLIC_KEY = 'SUA_CHAVE_PUBLICA_AQUI...';
// formato exigido: YTDL1.<payload_base64url>.<signature_base64url>
const [prefix, payloadB64, signatureB64] = providedKey.split('.');

const payloadBuffer = Buffer.from(payloadB64, 'base64url');
const signatureBuffer = Buffer.from(signatureB64, 'base64url');

const publicKey = createPublicKey({
  key: Buffer.from(LICENSE_PUBLIC_KEY, 'base64'),
  format: 'der',
  type: 'spki'
});

const isValid = verify(null, payloadBuffer, publicKey, signatureBuffer);
if (isValid) {
  const json = JSON.parse(payloadBuffer.toString('utf-8'));
  console.log("Licença Ativada para:", json.email, json.machineCode);
}
```

## ⚠️ Como revogar uma licença no banco
Para visualizar o status atual, acesse a interface web. Clique em "Revogar". 
Embora o Desktop valide matematicamente e offline as assinaturas, a revogação no banco servirá para listar localmente e poder integrar em futuras versões via API remota caso você deseje checar `revoked: true`. Para forçar a renovação, apenas gere uma nova Licença para o cliente. 
