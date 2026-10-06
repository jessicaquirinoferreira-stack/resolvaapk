/**
 * Vercel Blob Storage Integration for Resolva Fácil
 * Shared across the main site and the PWA.
 * 
 * Rules:
 * 1. Existing image/document URLs (e.g. https://...public.blob.vercel-storage.com/...)
 *    stored in Firestore are rendered directly.
 * 2. BLOB_READ_WRITE_TOKEN is server-only and NEVER exposed in client-side code.
 */

export function isVercelBlobUrl(url?: string): boolean {
  if (!url) return false;
  return url.includes('.blob.vercel-storage.com') || url.startsWith('https://');
}

export function formatBlobDisplayUrl(url?: string, fallback = '/logo.png'): string {
  if (!url || typeof url !== 'string' || !url.trim()) return fallback;
  return url.trim();
}
