#!/bin/bash
set -e

UUID="icon-launcher@omakasui.org"
EXTENSION_DIR="$HOME/.local/share/gnome-shell/extensions/$UUID"
REPO="Kasui92/icon-launcher"
TMP_DIR="/tmp/icon-launcher-ext-install-$$"

# Detect download tool
if command -v curl &> /dev/null; then
    DOWNLOAD_CMD="curl -fsSL"
elif command -v wget &> /dev/null; then
    DOWNLOAD_CMD="wget -qO-"
else
    echo "Error: neither curl nor wget found"
    exit 1
fi

# Get latest release URL
LATEST_RELEASE_URL="https://api.github.com/repos/$REPO/releases/latest"
ZIP_URL=$($DOWNLOAD_CMD "$LATEST_RELEASE_URL" | grep -o "https://.*\.zip" | head -1)

if [ -z "$ZIP_URL" ]; then
    echo "Error: Could not find latest release"
    exit 1
fi

# Create temp directory
mkdir -p "$TMP_DIR"
cd "$TMP_DIR"

# Download and extract
if command -v curl &> /dev/null; then
    curl -fsSL "$ZIP_URL" -o extension.zip
else
    wget -q "$ZIP_URL" -O extension.zip
fi

unzip -q extension.zip

# Install extension
mkdir -p "$EXTENSION_DIR"
cp -r * "$EXTENSION_DIR/"

# Cleanup
cd - >/dev/null
rm -rf "$TMP_DIR"

# Enable extension
gnome-extensions enable "$UUID" 2>/dev/null || true

echo "✓ Extension installed and enabled"
echo ""
echo "Restart GNOME Shell: Alt+F2 → r (Xorg) or logout (Wayland)"

