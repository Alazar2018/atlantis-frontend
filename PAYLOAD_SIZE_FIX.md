# Payload Size Limit Fix

## Problem
Getting `413 Payload Too Large` error when saving products with images because base64-encoded images can be very large (several MB).

## Solution Applied

### 1. Backend (Express.js)
- Increased body size limit to **50MB** in `server.js`:
  ```javascript
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  ```

### 2. Frontend (Next.js)
- Added route configuration for larger payloads:
  - `export const runtime = 'nodejs'`
  - `export const maxDuration = 30`
- Changed body parsing to use `request.text()` instead of `request.json()` for better handling of large payloads

### 3. Image Compression
- Added automatic image compression before converting to base64:
  - Max dimensions: 1920x1920 pixels
  - Quality: 75%
  - This reduces payload size by 60-80% typically

## Next.js Body Size Limit

**Important**: Next.js has a hard limit of **4.5MB** for API route request bodies. This cannot be changed via configuration.

If you still get 413 errors:
1. The images might be too large even after compression
2. Consider using fewer images per product
3. Consider implementing a proper image upload service (AWS S3, Cloudinary, etc.)
4. Reduce image dimensions further in `imageUtils.ts`

## Future Improvements

For production, consider:
1. **Cloud Storage**: Upload images to AWS S3, Cloudinary, or similar
2. **CDN**: Serve images from a CDN
3. **Separate Upload Endpoint**: Upload images separately, then reference URLs in product data
4. **Progressive Image Loading**: Load thumbnails first, full images on demand

## Testing

After restarting both servers, try saving a product with images. The compression should reduce the payload size significantly.

