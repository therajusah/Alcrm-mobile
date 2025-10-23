#!/bin/bash

echo "🚀 Building standalone APK (no development server required)..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
cd android
./gradlew clean

# Build release APK (standalone, no dev server needed)
echo "📱 Building release APK (standalone)..."
./gradlew assembleRelease

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Standalone build completed successfully!"
    
    # Get APK path
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
    
    if [ -f "$APK_PATH" ]; then
        # Get APK size
        APK_SIZE=$(ls -lh "$APK_PATH" | awk '{print $5}')
        echo "📦 APK Size: $APK_SIZE"
        echo "📍 APK Location: $(pwd)/$APK_PATH"
        
        # Copy to project root for easy access
        cp "$APK_PATH" "../alcrm-standalone.apk"
        echo "📋 APK copied to project root as: alcrm-standalone.apk"
        
        echo ""
        echo "🎉 Standalone build ready!"
        echo "📱 Install with: adb install alcrm-standalone.apk"
        echo "🔧 This APK runs independently without needing a development server"
        echo "💡 No Metro server required - perfect for testing and distribution!"
    else
        echo "❌ APK file not found at expected location"
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
