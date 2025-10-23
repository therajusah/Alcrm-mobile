#!/bin/bash

echo "🎨 Rebuilding app with new logo configuration..."

# Clean and rebuild with new logo
echo "🧹 Cleaning previous builds..."
cd android
./gradlew clean

# Prebuild to update native assets with new logo
echo "🔄 Running expo prebuild to update native assets..."
cd ..
npx expo prebuild --clean

# Build release APK with new logo
echo "📱 Building APK with new logo..."
cd android
./gradlew assembleRelease

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    
    # Get APK path
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
    
    if [ -f "$APK_PATH" ]; then
        # Get APK size
        APK_SIZE=$(ls -lh "$APK_PATH" | awk '{print $5}')
        echo "📦 APK Size: $APK_SIZE"
        echo "📍 APK Location: $(pwd)/$APK_PATH"
        
        # Copy to project root for easy access
        cp "$APK_PATH" "../alcrm-with-logo.apk"
        echo "📋 APK copied to project root as: alcrm-with-logo.apk"
        
        echo ""
        echo "🎉 App rebuilt with logo.png!"
        echo "📱 Install with: adb install alcrm-with-logo.apk"
        echo "🎨 The app icon and splash screen now use logo.png"
    else
        echo "❌ APK file not found at expected location"
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
