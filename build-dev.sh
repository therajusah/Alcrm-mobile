#!/bin/bash

echo "🚀 Building optimized development APK..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
cd android
./gradlew clean

# Build debug APK (optimized for development)
echo "📱 Building optimized debug APK..."
./gradlew assembleDebug

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Development build completed successfully!"
    
    # Get APK path
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
    
    if [ -f "$APK_PATH" ]; then
        # Get APK size
        APK_SIZE=$(ls -lh "$APK_PATH" | awk '{print $5}')
        echo "📦 APK Size: $APK_SIZE"
        echo "📍 APK Location: $(pwd)/$APK_PATH"
        
        # Copy to project root for easy access
        cp "$APK_PATH" "../alcrm-dev.apk"
        echo "📋 APK copied to project root as: alcrm-dev.apk"
        
        echo ""
        echo "🎉 Optimized development build ready!"
        echo "📱 Install with: adb install alcrm-dev.apk"
        echo "🔧 This is a debug build with optimizations for smaller size"
    else
        echo "❌ APK file not found at expected location"
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
