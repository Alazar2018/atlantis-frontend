#!/bin/bash
# Quick fix for Windows line endings in deploy.sh

# Fix deploy.sh
sed -i 's/\r$//' deploy.sh

# Make executable
chmod +x deploy.sh

echo "✅ Fixed line endings in deploy.sh"
echo "You can now run: bash deploy.sh"

