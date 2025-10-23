#!/bin/bash

echo "🎨 Rebuilding app with optimized configuration and new logo..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
cd android
./gradlew clean

# Prebuild to update native assets with new logo
echo "🔄 Running expo prebuild to update native assets..."
cd ..
npx expo prebuild --clean

# Build optimized release APK
echo "📱 Building optimized release APK..."
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
        cp "$APK_PATH" "../alcrm-optimized.apk"
        echo "📋 APK copied to project root as: alcrm-optimized.apk"
        
        echo ""
        echo "🎉 Optimized build ready!"
        echo "📱 Install with: adb install alcrm-optimized.apk"
        echo "🎨 App icon and splash screen now use icon-a.svg with white background"
        echo "🔧 Optimized for smaller size with ARM64-only build"
    else
        echo "❌ APK file not found at expected location"
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
