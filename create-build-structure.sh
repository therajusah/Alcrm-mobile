#!/bin/bash

# Simple APK Build Script for ALCRM Mobile App
# This creates a basic APK structure that can be built manually

set -e

echo "🚀 Creating APK Build Structure..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Create build directory
BUILD_DIR="build"
APK_DIR="$BUILD_DIR/apk"

print_status "Creating build directories..."
mkdir -p "$APK_DIR"
mkdir -p "$BUILD_DIR/assets"

# Copy app files
print_status "Copying app files..."
cp -r src "$BUILD_DIR/"
cp App.tsx "$BUILD_DIR/"
cp app.json "$BUILD_DIR/"
cp package.json "$BUILD_DIR/"
cp tsconfig.json "$BUILD_DIR/"
cp babel.config.js "$BUILD_DIR/"
cp metro.config.js "$BUILD_DIR/"
cp tailwind.config.js "$BUILD_DIR/"
cp postcss.config.js "$BUILD_DIR/"

# Create a simple build info file
print_status "Creating build info..."
cat > "$BUILD_DIR/build-info.txt" << EOF
ALCRM Mobile App Build
=====================
Build Date: $(date)
Version: 1.0.0
Package: com.alcrm.mobile

Build Instructions:
1. Install Android Studio
2. Set up Android SDK
3. Run: npx expo run:android --variant debug
4. Or use: cd android && ./gradlew assembleDebug

APK Location (after build):
- Debug: android/app/build/outputs/apk/debug/app-debug.apk
- Release: android/app/build/outputs/apk/release/app-release.apk

Features Included:
- OTP-based signup with email verification
- Complete onboarding flow with resume upload
- Job browsing and application system
- Profile management with resume handling
- Mentorship session management
- Free resources browsing
- Application tracking
- Settings and password change

Dependencies:
- React Native with Expo
- NativeWind (Tailwind CSS)
- Zustand for state management
- React Navigation v6
- Axios for API calls
- Expo Document Picker for file uploads
EOF

# Create a simple APK installer script
print_status "Creating APK installer script..."
cat > "$BUILD_DIR/install-apk.sh" << 'EOF'
#!/bin/bash

# APK Installer Script
echo "📱 ALCRM Mobile App - APK Installer"
echo "===================================="

# Check if Android device is connected
if ! adb devices | grep -q "device$"; then
    echo "❌ No Android device connected or ADB not found"
    echo "Please:"
    echo "1. Connect your Android device via USB"
    echo "2. Enable USB Debugging in Developer Options"
    echo "3. Install Android SDK Platform Tools"
    exit 1
fi

# Find APK files
APK_FILES=(
    "android/app/build/outputs/apk/debug/app-debug.apk"
    "android/app/build/outputs/apk/release/app-release.apk"
)

APK_FOUND=""
for apk in "${APK_FILES[@]}"; do
    if [ -f "$apk" ]; then
        APK_FOUND="$apk"
        break
    fi
done

if [ -z "$APK_FOUND" ]; then
    echo "❌ No APK file found. Please build the app first:"
    echo "   npm run build:android-debug"
    exit 1
fi

echo "📦 Found APK: $APK_FOUND"
echo "📱 Installing to device..."

# Install APK
if adb install "$APK_FOUND"; then
    echo "✅ APK installed successfully!"
    echo "🎉 You can now open ALCRM Mobile App on your device"
else
    echo "❌ Failed to install APK"
    echo "Try: adb install -r $APK_FOUND"
fi
EOF

chmod +x "$BUILD_DIR/install-apk.sh"

# Create a development build script
print_status "Creating development build script..."
cat > "$BUILD_DIR/dev-build.sh" << 'EOF'
#!/bin/bash

# Development Build Script
echo "🔧 ALCRM Mobile App - Development Build"
echo "======================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔍 Running type check..."
npm run type-check

echo "🧹 Running lint fix..."
npm run lint:fix

echo "🎨 Running format..."
npm run format

echo "🏗️ Prebuilding project..."
npm run prebuild:clean

echo "📱 Building Android APK..."
npm run build:android-debug

echo "✅ Build completed!"
echo "📁 APK location: android/app/build/outputs/apk/debug/app-debug.apk"
EOF

chmod +x "$BUILD_DIR/dev-build.sh"

# Create a simple README for the build
print_status "Creating build README..."
cat > "$BUILD_DIR/README.md" << 'EOF'
# ALCRM Mobile App - Build Package

This directory contains all the necessary files to build the ALCRM Mobile App.

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build APK**
   ```bash
   ./dev-build.sh
   ```

3. **Install on Device**
   ```bash
   ./install-apk.sh
   ```

## Manual Build Steps

1. **Install Prerequisites**
   - Node.js (v18+)
   - Android Studio
   - Android SDK
   - Java JDK 17+

2. **Build Commands**
   ```bash
   # Install dependencies
   npm install
   
   # Run checks
   npm run type-check
   npm run lint:check
   
   # Prebuild
   npm run prebuild:clean
   
   # Build APK
   npm run build:android-debug
   ```

3. **APK Location**
   - Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
   - Release: `android/app/build/outputs/apk/release/app-release.apk`

## Troubleshooting

- **Metro bundler issues**: Try `npx expo start --clear`
- **Android build fails**: Check Android SDK installation
- **Permission issues**: Run `chmod +x *.sh`

## App Features

- ✅ OTP-based signup with email verification
- ✅ Complete onboarding flow with resume upload
- ✅ Job browsing and application system
- ✅ Profile management with resume handling
- ✅ Mentorship session management
- ✅ Free resources browsing
- ✅ Application tracking
- ✅ Settings and password change

## Support

If you encounter issues, check the build logs and ensure all prerequisites are installed correctly.
EOF

print_success "Build structure created successfully!"
echo ""
echo "📁 Build directory: $BUILD_DIR"
echo "📋 Next steps:"
echo "   1. cd $BUILD_DIR"
echo "   2. ./dev-build.sh"
echo "   3. ./install-apk.sh"
echo ""
echo "📖 For detailed instructions, see: $BUILD_DIR/README.md"
echo "📄 Build info: $BUILD_DIR/build-info.txt"
