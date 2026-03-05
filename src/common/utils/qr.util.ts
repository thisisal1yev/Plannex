import { createHash, randomUUID } from 'crypto';

/**
 * Generates a unique QR code string
 * Combines UUID with a crypto signature for security
 */
export function generateQRCode(
  secret: string = process.env.JWT_SECRET || 'default-secret',
): string {
  const uuid = randomUUID();
  const signature = createHash('sha256')
    .update(uuid + secret)
    .digest('hex')
    .substring(0, 8);

  return `${uuid}-${signature}`;
}

/**
 * Validates a QR code string
 * Verifies the signature matches the UUID
 */
export function validateQRCode(
  qrCode: string,
  secret: string = process.env.JWT_SECRET || 'default-secret',
): boolean {
  const parts = qrCode.split('-');

  if (parts.length !== 2) {
    return false;
  }

  const [uuid, signature] = parts;
  const expectedSignature = createHash('sha256')
    .update(uuid + secret)
    .digest('hex')
    .substring(0, 8);

  return signature === expectedSignature;
}
