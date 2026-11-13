# Files to EXCLUDE when uploading frontend to VPS

When uploading your frontend to the VPS server, exclude these files/directories:

## CRITICAL - Must Exclude:

### 1. **node_modules/** 
   - Large directory (hundreds of MB)
   - Will be installed fresh on server with `npm install`
   - Uploading this is SLOW and unnecessary

### 2. **.next/** 
   - Next.js build output directory
   - Will be regenerated on server with `npm run build`
   - Contains temporary build artifacts

### 3. **.env** and **.env.local**
   - Local development environment variables
   - Contains sensitive local configuration
   - You'll create `.env.production` on server instead

### 4. **.git/**
   - Git repository data (if not using git on server)
   - If you ARE using git on server, you can keep this

### 5. **logs/**
   - PM2 log files (if exist)
   - Will be created automatically on server

## RECOMMENDED - Exclude These Too:

### 6. **npm-debug.log***
   - Debug log files
   - Not needed on server

### 7. **yarn-debug.log*** and **yarn-error.log***
   - Yarn log files (if you use yarn)
   - Not needed on server

### 8. **.DS_Store**
   - macOS system files
   - Not needed on Linux server

### 9. ***.tsbuildinfo**
   - TypeScript build info files
   - Will be regenerated

### 10. **.vercel/**
   - Vercel deployment files (if you use Vercel)
   - Not needed for self-hosted deployment

### 11. **coverage/**
   - Test coverage reports
   - Not needed in production

### 12. **out/**
   - Export output directory (if using static export)
   - Will be regenerated if needed

## INCLUDE - These Files Are Needed:

✅ **package.json** - Required for npm install
✅ **package-lock.json** - Ensures consistent dependencies
✅ **next.config.js** - Next.js configuration
✅ **tsconfig.json** - TypeScript configuration
✅ **tailwind.config.ts** - Tailwind CSS configuration
✅ **postcss.config.mjs** - PostCSS configuration
✅ **src/** - All source code
✅ **public/** - Static assets (images, etc.)
✅ **scripts/** - Deployment scripts
✅ **ecosystem.config.js** - PM2 configuration
✅ **nginx-frontend.conf** - Nginx configuration
✅ **env.production.template** - Template for production env
✅ **.gitignore** - Useful reference

## Upload Methods:

### Option 1: Using rsync (Recommended)

```bash
# From your local machine
rsync -avz --exclude 'node_modules' \
           --exclude '.next' \
           --exclude '.env*' \
           --exclude '.git' \
           --exclude 'logs' \
           --exclude 'npm-debug.log*' \
           --exclude '.DS_Store' \
           --exclude '*.tsbuildinfo' \
           atlantis-frontend/ user@your-vps-ip:/var/www/frontend/
```

### Option 2: Using scp with tar

```bash
# Create archive excluding unnecessary files
cd atlantis-frontend
tar --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.env*' \
    --exclude='.git' \
    --exclude='logs' \
    --exclude='npm-debug.log*' \
    --exclude='.DS_Store' \
    -czf ../frontend-deploy.tar.gz .

# Upload archive
scp ../frontend-deploy.tar.gz user@your-vps-ip:/var/www/

# On server, extract
ssh user@your-vps-ip
cd /var/www
tar -xzf frontend-deploy.tar.gz -C frontend
```

### Option 3: Using Git (Best Practice)

```bash
# On VPS server
cd /var/www
git clone your-repo-url frontend
cd frontend
git checkout main  # or your production branch

# .gitignore will handle exclusions automatically
npm install
npm run build
```

### Option 4: Using FTP/SFTP Client

If using FileZilla or similar:
1. Set up exclusion filters:
   - `node_modules`
   - `.next`
   - `.env*`
   - `.git`
   - `logs`
   - `npm-debug.log*`

2. Upload everything else

## Quick Checklist:

Before uploading, verify you're NOT including:
- [ ] node_modules/
- [ ] .next/
- [ ] .env or .env.local
- [ ] .git/ (unless using git on server)
- [ ] logs/
- [ ] npm-debug.log*

After uploading to server:
- [ ] Create `.env.production` from template
- [ ] Run `npm install` (this installs node_modules)
- [ ] Run `npm run build` (this creates .next)
- [ ] Run deployment script

## File Size Comparison:

- **With exclusions**: ~5-20 MB (source code only)
- **Without exclusions**: ~200-500 MB (includes node_modules)

**Excluding node_modules alone saves 90%+ of upload time!**

