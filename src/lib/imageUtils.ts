import type { Area } from "react-easy-crop";

/**
 * Utility functions for handling images
 */

/**
 * Compress image by reducing quality and/or size
 */
function compressImage(file: File, maxWidth: number = 1920, maxHeight: number = 1920, quality: number = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Compression failed'));
            }
          },
          file.type,
          quality
        );
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert blob URL to base64 data URL with optional compression
 */
export async function blobToDataURL(blobUrl: string, compress: boolean = true): Promise<string> {
  try {
    // If it's already a data URL, return as is
    if (blobUrl.startsWith('data:')) {
      return blobUrl;
    }

    // If it's not a blob URL, return as is (might be a regular URL)
    if (!blobUrl.startsWith('blob:')) {
      return blobUrl;
    }

    // Fetch the blob
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    
    // Compress if requested and it's an image
    let finalBlob = blob;
    if (compress && blob.type.startsWith('image/')) {
      try {
        const file = new File([blob], 'image.jpg', { type: blob.type });
        const compressedFile = await compressImage(file, 1920, 1920, 0.75);
        finalBlob = compressedFile;
      } catch (error) {
        console.warn('Image compression failed, using original:', error);
        // Continue with original blob if compression fails
      }
    }
    
    // Convert to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(finalBlob);
    });
  } catch (error) {
    console.error('Error converting blob to data URL:', error);
    return blobUrl; // Return original if conversion fails
  }
}

/**
 * Convert array of blob URLs to data URLs
 */
export async function convertBlobUrlsToDataUrls(urls: string[]): Promise<string[]> {
  try {
    const promises = urls.map(url => blobToDataURL(url));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error converting blob URLs:', error);
    return urls; // Return original if conversion fails
  }
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.crossOrigin = "anonymous";
    image.src = src;
  });
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Crop an image to the provided pixel area and return a new File with preview data URL.
 */
export async function cropImageWithFocus(
  src: string,
  pixelCrop: Area,
  originalFile: File,
  mimeType?: string,
  quality: number = 0.92
): Promise<{ file: File; dataUrl: string }> {
  if (!pixelCrop) {
    throw new Error("Pixel crop is required to perform cropping");
  }

  const image = await loadImage(src);
  const canvas = document.createElement("canvas");

  const width = Math.max(1, Math.round(pixelCrop.width));
  const height = Math.max(1, Math.round(pixelCrop.height));

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context for cropping");
  }

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    width,
    height
  );

  const outputType = mimeType || originalFile.type || "image/jpeg";
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (createdBlob) => {
        if (createdBlob) {
          resolve(createdBlob);
        } else {
          reject(new Error("Canvas is empty, cannot create blob"));
        }
      },
      outputType,
      quality
    );
  });

  const croppedFile = new File([blob], originalFile.name, {
    type: blob.type,
    lastModified: Date.now(),
  });

  const dataUrl = await blobToBase64(blob);

  return { file: croppedFile, dataUrl };
}

/**
 * Check if a URL is a blob URL
 */
export function isBlobUrl(url: string): boolean {
  return url.startsWith('blob:');
}

/**
 * Check if a URL is a data URL
 */
export function isDataUrl(url: string): boolean {
  return url.startsWith('data:');
}

