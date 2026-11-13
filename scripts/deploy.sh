#!/bin/bash

# Atlantic Leather Frontend Deployment Script
# Deploys the Next.js frontend application

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 Atlantic Leather Frontend Deployment"
echo "======================================="

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo ""
echo "Step 1: Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi
NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 not found. Installing globally...${NC}"
    sudo npm install -g pm2
fi
PM2_VERSION=$(pm2 --version)
echo -e "${GREEN}✅ PM2: v$PM2_VERSION${NC}"

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}⚠️  .env.production not found!${NC}"
    if [ -f env.production.template ]; then
        echo "Creating .env.production from template..."
        cp env.production.template .env.production
        echo -e "${YELLOW}Please edit .env.production with your settings:${NC}"
        echo "  - NEXT_PUBLIC_API_URL (backend URL)"
        echo "  - NEXT_PUBLIC_API_KEY (public API key)"
        read -p "Press Enter after editing .env.production..."
    else
        echo -e "${RED}❌ env.production.template not found!${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ .env.production exists${NC}"

echo ""
echo "Step 2: Installing dependencies..."
npm install

echo ""
echo "Step 3: Building Next.js application..."
npm run build

echo ""
echo "Step 4: Creating logs directory..."
mkdir -p logs

echo ""
echo "Step 5: Stopping existing PM2 process (if any)..."
pm2 delete atlantis-frontend 2>/dev/null || true

echo ""
echo "Step 6: Starting application with PM2..."
pm2 start ecosystem.config.js

echo ""
echo "Step 7: Saving PM2 process list..."
pm2 save

echo ""
echo "Step 8: Checking application status..."
sleep 2
pm2 status

echo ""
echo "Step 9: Viewing logs (last 20 lines)..."
echo "=========================="
pm2 logs atlantis-frontend --lines 20 --nostream

echo ""
echo "=========================="
echo -e "${GREEN}✅ Frontend deployment completed!${NC}"
echo ""
echo "Your frontend should be running on: http://localhost:3000"
echo ""
echo "Next steps:"
echo "1. Configure Nginx to proxy to port 3000"
echo "2. Setup SSL certificate with Certbot"
echo "3. Test the site: https://atlanticleatherethiopia.com"
echo ""
echo "Useful commands:"
echo "  pm2 status              - Check application status"
echo "  pm2 logs atlantis-frontend - View logs"
echo "  pm2 restart atlantis-frontend - Restart application"
