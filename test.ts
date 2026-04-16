import { generateLicenseKey } from './src/lib/crypto.ts';
import 'dotenv/config';

const payload = {
  product: 'yt-download',
  version: 1,
  email: 'davi@gmail.com',
  machineCode: '0AED3943E931B5CEDF1BCA835507BAF2',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
};

try {
  const key = generateLicenseKey(payload, process.env.LICENSE_PRIVATE_KEY_B64);
  console.log('Success:', key);
} catch (e) {
  console.error('Error generating key:', e);
}
