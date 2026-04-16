import { createPublicKey, createPrivateKey, sign, verify } from 'crypto';

export interface LicensePayload {
  product: string;
  version: number;
  machineCode: string;
  iat: number;
  exp: number;
}

export function toBase64Url(buffer: Buffer | string): string {
  const buf = typeof buffer === 'string' ? Buffer.from(buffer, 'utf-8') : buffer;
  return buf.toString('base64url'); // Node.js v14.18+ supports base64url directly
}

export function signPayload(payload: LicensePayload, privateKeyB64: string): string {
  // Parsing the key back from DER+base64 to a createPrivateKey object
  const privateKey = createPrivateKey({
    key: Buffer.from(privateKeyB64, 'base64'),
    format: 'der',
    type: 'pkcs8'
  });

  const payloadString = JSON.stringify(payload);
  const payloadBuffer = Buffer.from(payloadString, 'utf-8');

  // A safer approach for purely ed25519 in Node:
  return cryptoSignEd25519(payloadBuffer, privateKey);
}

function cryptoSignEd25519(data: Buffer, privateKey: any): string {
    const signature = sign(null, data, privateKey);
    return signature.toString('base64url');
}

export function generateLicenseKey(payload: LicensePayload, privateKeyB64: string): string {
  const payloadBase64Url = toBase64Url(JSON.stringify(payload));
  const signatureBase64Url = signPayload(payload, privateKeyB64);
  return `YTDL1.${payloadBase64Url}.${signatureBase64Url}`;
}

export function verifyLicense(licenseKey: string, publicKeyB64: string): boolean {
  if (!licenseKey.startsWith('YTDL1.')) return false;

  const parts = licenseKey.split('.');
  if (parts.length !== 3) return false;

  const payloadBase64Url = parts[1];
  const signatureBase64Url = parts[2];

  const payloadBuffer = Buffer.from(payloadBase64Url, 'base64url');
  const signatureBuffer = Buffer.from(signatureBase64Url, 'base64url');

  const publicKey = createPublicKey({
    key: Buffer.from(publicKeyB64, 'base64'),
    format: 'der',
    type: 'spki'
  });

  return verify(null, payloadBuffer, publicKey, signatureBuffer);
}
