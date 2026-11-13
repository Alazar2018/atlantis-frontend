# Setting Up Public API Key

To enable the frontend to fetch products and categories from the backend, you need to configure the API key.

## Steps:

1. **Start the backend server** (if not already running):
   ```bash
   cd atlantis-backend
   npm run dev
   ```

2. **Log in to the admin panel**:
   - Go to `http://localhost:3000/login`
   - Use the admin credentials

3. **Create an API Key**:
   - Navigate to "API Keys" in the admin sidebar
   - Click "Create API Key"
   - Enter a name (e.g., "Frontend Website")
   - Click "Create API Key"
   - **IMPORTANT**: Copy the Public Key immediately (you'll only see it once)

4. **Configure the frontend environment**:
   - Create or update `atlantis-frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_KEY=your_public_key_here
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

5. **Restart the frontend server**:
   ```bash
   cd atlantis-frontend
   npm run dev
   ```

6. **Verify it's working**:
   - Check the browser console for API response logs
   - Products should now load from the backend
   - If you see errors, verify:
     - Backend server is running
     - API key is correct in `.env.local`
     - You have published products in the database

## Troubleshooting

- **"API key not configured" error**: Make sure `NEXT_PUBLIC_API_KEY` is set in `.env.local` and you've restarted the dev server
- **401 Unauthorized**: Check that the API key is active in the admin panel
- **No products showing**: Make sure you have published products in the database (admin panel > Products > Publish)
- **Images not showing**: Check browser console for image loading errors, and ensure product images are valid URLs

