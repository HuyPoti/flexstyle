// utils/imageUtils.ts
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const getMimeTypeFromBase64 = (base64: string): string => {
  const matches = base64.match(/^data:(.*?);base64,/);
  return matches && matches[1] ? matches[1] : 'application/octet-stream';
};

// Normalize image URL coming from backend. Handles values like:
// - "https://..."
// - "//domain/..."
// - "domain/..."
export const normalizeImageUrl = (url?: string | null): string | null => {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
    return trimmed;
  if (trimmed.startsWith("//")) return "https:" + trimmed;
  // if it looks like it already has a scheme prefix like "https:..."
  if (trimmed.startsWith("https:")) return trimmed;
  // fallback to https
  return "https://" + trimmed;
};
