import { nanoid } from 'nanoid';
import QRCode from '@/models/QRCode';

export function generateShortCode(length: number = 8): string {
  return nanoid(length);
}

export async function generateUniqueShortCode(): Promise<string> {
  let shortCode: string;
  let exists = true;

  // Keep generating until we find a unique code
  while (exists) {
    shortCode = generateShortCode();
    const existing = await QRCode.findOne({ shortCode });
    exists = !!existing;
  }

  return shortCode!;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
