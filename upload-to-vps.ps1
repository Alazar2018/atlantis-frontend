# Quick Upload Script for Frontend
# Run this from your LOCAL machine (Windows PowerShell or Git Bash)

# ============================================
# CONFIGURATION - Update these values!
# ============================================
$VPS_USER = "your_username"  # e.g., "maxim" or "ubuntu"
$VPS_IP = "your_vps_ip"      # e.g., "123.456.789.0"
$VPS_PATH = "/var/www/frontend"  # Destination path on server

# ============================================
# OPTION 1: Using rsync (if available on Windows)
# ============================================
# Install rsync for Windows: https://github.com/cwRsync/cwRsync

Write-Host "🚀 Uploading frontend to VPS..." -ForegroundColor Green

rsync -avz --exclude-from=rsync-exclude.txt `
     --exclude='node_modules' `
     --exclude='.next' `
     --exclude='.env*' `
     --exclude='.git' `
     --exclude='logs' `
     ./ $VPS_USER@$VPS_IP:$VPS_PATH/

Write-Host "✅ Upload complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps on server:" -ForegroundColor Yellow
Write-Host "  cd $VPS_PATH" -ForegroundColor Cyan
Write-Host "  cp env.production.template .env.production" -ForegroundColor Cyan
Write-Host "  nano .env.production  # Edit with your settings" -ForegroundColor Cyan
Write-Host "  npm install" -ForegroundColor Cyan
Write-Host "  npm run build" -ForegroundColor Cyan
Write-Host "  bash scripts/deploy.sh" -ForegroundColor Cyan

# ============================================
# OPTION 2: Using Git (Recommended)
# ============================================
# If you have git on server, just clone:
#
# ssh $VPS_USER@$VPS_IP
# cd /var/www
# git clone your-repo-url frontend
# cd frontend
# cp env.production.template .env.production
# nano .env.production
# npm install
# npm run build
# bash scripts/deploy.sh

# ============================================
# OPTION 3: Using scp with tar (Alternative)
# ============================================
#
# # Create archive excluding unnecessary files
# tar --exclude='node_modules' `
#     --exclude='.next' `
#     --exclude='.env*' `
#     --exclude='.git' `
#     --exclude='logs' `
#     --exclude='npm-debug.log*' `
#     --exclude='.DS_Store' `
#     -czf ../frontend-deploy.tar.gz .
#
# # Upload archive
# scp ../frontend-deploy.tar.gz $VPS_USER@$VPS_IP:/var/www/
#
# # On server:
# ssh $VPS_USER@$VPS_IP
# cd /var/www
# tar -xzf frontend-deploy.tar.gz -C frontend
# cd frontend
# cp env.production.template .env.production
# nano .env.production
# npm install
# npm run build
# bash scripts/deploy.sh

