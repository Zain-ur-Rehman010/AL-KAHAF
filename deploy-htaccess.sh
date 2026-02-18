#!/bin/bash

# AlKahaf - Production .htaccess Deployment Script
# This script backs up your current .htaccess and deploys the new secure version

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}AlKahaf .htaccess Deployment Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Configuration
REMOTE_USER="your_cpanel_username"
REMOTE_HOST="alkahafonlineacademy.com"
REMOTE_PATH="/home/username/public_html"
LOCAL_HTACCESS="frontend/.htaccess.production"

echo -e "${YELLOW}This script will:${NC}"
echo "1. Backup your current .htaccess file"
echo "2. Upload the new secure .htaccess configuration"
echo "3. Test if the configuration works"
echo ""

# Ask for confirmation
read -p "Do you want to proceed? (yes/no): " -r
echo
if [[ ! $REPLY =~ ^[Yy](es)?$ ]]
then
    echo -e "${RED}Deployment cancelled.${NC}"
    exit 1
fi

# Ask for SSH details
read -p "Enter your cPanel username: " REMOTE_USER
read -p "Enter your domain or server IP: " REMOTE_HOST
read -p "Enter the full path to your public_html (e.g., /home/username/public_html): " REMOTE_PATH

echo ""
echo -e "${GREEN}Step 1: Backing up current .htaccess...${NC}"

# Create backup on remote server
ssh ${REMOTE_USER}@${REMOTE_HOST} "cd ${REMOTE_PATH} && if [ -f .htaccess ]; then cp .htaccess .htaccess.backup.\$(date +%Y%m%d_%H%M%S); echo 'Backup created'; else echo 'No existing .htaccess found'; fi"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backup complete${NC}"
else
    echo -e "${RED}✗ Backup failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Step 2: Uploading new .htaccess...${NC}"

# Upload new .htaccess
scp ${LOCAL_HTACCESS} ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/.htaccess

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Upload complete${NC}"
else
    echo -e "${RED}✗ Upload failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Step 3: Testing configuration...${NC}"

# Test if site is accessible
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://${REMOTE_HOST}/courses)

if [ "$RESPONSE" == "200" ] || [ "$RESPONSE" == "302" ]; then
    echo -e "${GREEN}✓ Configuration working! (HTTP $RESPONSE)${NC}"
else
    echo -e "${YELLOW}⚠ Received HTTP $RESPONSE - Please verify manually${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Visit https://${REMOTE_HOST}/courses to verify clean URLs work"
echo "2. Check that old URLs redirect: https://${REMOTE_HOST}/src/pages/courses/course-grid.html"
echo "3. If something breaks, restore backup with:"
echo "   ${YELLOW}ssh ${REMOTE_USER}@${REMOTE_HOST} 'cd ${REMOTE_PATH} && cp .htaccess.backup.* .htaccess'${NC}"
echo ""