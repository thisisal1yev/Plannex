import { createHash } from 'crypto';
import { nanoid } from 'nanoid';

export function generateQRCode(
  secret: string = process.env.JWT_SECRET || 'default-secret',
): string {
  const id = nanoid(21);
  const signature = createHash('sha256')
    .update(id + secret)
    .digest('hex')
    .substring(0, 8);

  return `${id}-${signature}`;
}

export function validateQRCode(
  qrCode: string,
  secret: string = process.env.JWT_SECRET || 'default-secret',
): boolean {
  const lastDash = qrCode.lastIndexOf('-');
  if (lastDash === -1) return false;

  const id = qrCode.substring(0, lastDash);
  const signature = qrCode.substring(lastDash + 1);

  const expectedSignature = createHash('sha256')
    .update(id + secret)
    .digest('hex')
    .substring(0, 8);

  return signature === expectedSignature;
}
