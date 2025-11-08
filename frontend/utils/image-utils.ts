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
