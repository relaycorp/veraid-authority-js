import { generateKeyPair } from 'node:crypto';
import { promisify } from 'node:util';

const generateKeyPairAsync = promisify(generateKeyPair);

export async function generatePublicKey(): Promise<CryptoKey> {
  const keyPair = await generateKeyPairAsync('rsa-pss', { modulusLength: 2048 });
  const publicKeyJwk = keyPair.publicKey.export({ format: 'jwk' });
  return crypto.subtle.importKey('jwk', publicKeyJwk, { name: 'RSA-PSS', hash: 'SHA-256' }, true, [
    'verify',
  ]);
}

export async function derSerialisePublicKey(key: CryptoKey): Promise<Buffer> {
  const keyDer = await crypto.subtle.exportKey('spki', key);
  return Buffer.from(keyDer);
}
