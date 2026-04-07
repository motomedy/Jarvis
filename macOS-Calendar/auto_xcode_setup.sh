#!/bin/bash
# Fully automated Xcode project setup for macOS-Calendar
# Usage: Run from anywhere, will cd to correct folder and set up project

set -e

PROJECT_DIR="/Users/ahmedmansi/Desktop/Jarvis/Jarvis/macOS-Calendar"
PROJECT_NAME="macOS-Calendar"
PLIST_FILE="Info.plist"

cd "$PROJECT_DIR"

# Check for Xcode command line tools
if ! xcode-select -p > /dev/null; then
  echo "Xcode command line tools not found. Please install them first."
  exit 1
fi

# Remove any old project
rm -rf "$PROJECT_NAME.xcodeproj" "$PROJECT_NAME.xcworkspace" .build .swiftpm Package.swift Sources Tests

# Create a new SwiftUI macOS app project
swift package init --type executable

# Move all Swift files and Info.plist into Sources/$PROJECT_NAME
mkdir -p "Sources/$PROJECT_NAME"
mv *.swift "Sources/$PROJECT_NAME/" 2>/dev/null || true
mv "$PLIST_FILE" "Sources/$PROJECT_NAME/" 2>/dev/null || true

# Generate Xcode project
swift package generate-xcodeproj

# Open the project in Xcode
echo "Opening $PROJECT_NAME.xcodeproj in Xcode..."
open "$PROJECT_NAME.xcodeproj"

echo "If needed, set Info.plist in the project settings and ensure all .swift files are in the build target."
