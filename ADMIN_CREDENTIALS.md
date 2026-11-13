# Admin Login Credentials

## Sample Admin Credentials

Staff sign-in uses the account stored in the database. Do not put the password in this file.

---

## Security Notes

- These credentials are for development only
- In production, these should be stored securely in a backend database
- Passwords should be hashed using bcrypt or similar
- Consider implementing JWT tokens for secure authentication
- Enable HTTPS in production
- Implement rate limiting on login endpoints
- Add 2FA (Two-Factor Authentication) for enhanced security

## API Routes Created

1. **POST `/api/auth/login`** - Authenticates user and sets secure cookie
2. **POST `/api/auth/logout`** - Logs out user and clears cookie
3. **GET `/api/auth/check`** - Checks authentication status

## Features Implemented

✅ Server-side authentication routes  
✅ HTTP-only cookies for secure token storage  
✅ Login button hidden when authenticated  
✅ Admin layout checks authentication on load  
✅ Secure logout functionality  
✅ Sample credentials displayed on login page

