#!/bin/bash
# Script to create an Xcode project for the macOS-Calendar app and import all Swift/Info.plist files

set -e

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_NAME="macOS-Calendar"
PROJECT_PATH="$APP_DIR/$PROJECT_NAME.xcodeproj"

# Check for Xcode command line tools
if ! xcode-select -p > /dev/null; then
  echo "Xcode command line tools not found. Please install them first."
  exit 1
fi

# Create new Xcode project if it doesn't exist
if [ ! -d "$PROJECT_PATH" ]; then
  echo "Creating new Xcode project..."
  swift package init --type executable
  rm -rf Sources Tests Package.swift .gitignore
  xcodebuild -project "$PROJECT_NAME.xcodeproj" -list > /dev/null 2>&1 || true
  rm -rf $PROJECT_NAME.xcodeproj
  swift package generate-xcodeproj
  mv $PROJECT_NAME.xcodeproj "$PROJECT_PATH"
fi

# Copy all Swift and Info.plist files into the project directory
for f in "$APP_DIR"/*.swift "$APP_DIR"/Info.plist; do
  if [ -f "$f" ]; then
    cp "$f" "$APP_DIR"
  fi
done

echo "Open $PROJECT_PATH in Xcode, add all .swift and Info.plist files to the project navigator, and set Info.plist in project settings."
echo "Then build and run!"
