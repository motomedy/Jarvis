#!/bin/bash
# Script to automate iOS app project setup in Xcode
# Usage: ./scripts/setup_ios_project.sh

IOS_DIR="$(dirname "$0")/../ios-voice-assistant"
PROJECT_NAME="JarvisVoiceAssistant"

cd "$IOS_DIR" || { echo "ios-voice-assistant folder not found!"; exit 1; }

# Create Xcode project if not exists
echo "Checking for Xcode project..."
if [ ! -d "$PROJECT_NAME.xcodeproj" ]; then
  echo "Creating new SwiftUI Xcode project: $PROJECT_NAME"
  xcodebuild -project "$PROJECT_NAME.xcodeproj" || open -n -a Xcode .
  echo "Please create a new SwiftUI App project named $PROJECT_NAME in this folder if prompted."
fi

# Add all Swift files and Info.plist to the project
echo "Adding Swift files and Info.plist to Xcode project..."
for file in *.swift Info.plist; do
  if [ -f "$file" ]; then
    osascript -e 'tell application "Xcode" to open POSIX file "'$IOS_DIR/$file'"'
  fi
done

echo "Setup complete. Please set your Bundle Identifier and signing in Xcode, then build and run on your device."
