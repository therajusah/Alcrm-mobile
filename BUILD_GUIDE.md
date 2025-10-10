# ALCRM Mobile App - Local Build Guide

This guide will help you build the ALCRM Mobile App locally and generate an APK file without using EAS (Expo Application Services).

## 📋 Prerequisites

Before building the app, make sure you have the following installed:

### Required Software

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Expo CLI**
   - Install globally: `npm install -g @expo/cli`
   - Verify installation: `expo --version`

### Optional but Recommended

4. **Android Studio** (for Android SDK)
   - Download from: https://developer.android.com/studio
   - Install Android SDK and build tools
   - Set `ANDROID_HOME` environment variable

5. **Java Development Kit (JDK)**
   - Download JDK 17 or higher
   - Set `JAVA_HOME` environment variable

## 🚀 Quick Build (Automated)

### For macOS/Linux:
```bash
./build-apk.sh
```

### For Windows:
```cmd
build-apk.bat
```

## 🔧 Manual Build Process

If you prefer to run the build steps manually:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Code Quality Checks
```bash
# Type checking
npm run type-check

# Linting
npm run lint:check

# Format checking
npm run format:check
```

### 3. Prebuild the Project
```bash
# Clean prebuild (removes existing android/ios folders)
npm run prebuild:clean

# Or regular prebuild
npm run prebuild
```

### 4. Build Android APK
```bash
# Build debug APK
npm run build:android-debug

# Build release APK (requires signing)
npm run build:android
```

## 📱 APK Output Locations

After a successful build, you'll find APK files in:

```
android/app/build/outputs/apk/
├── debug/
│   └── app-debug.apk
└── release/
    └── app-release.apk
```

## 🔍 Troubleshooting

### Common Issues

1. **"expo: command not found"**
   ```bash
   npm install -g @expo/cli
   ```

2. **"ANDROID_HOME not set"**
   - Install Android Studio
   - Set environment variable:
     ```bash
     export ANDROID_HOME=/path/to/android/sdk
     ```

3. **"Java not found"**
   - Install JDK 17+
   - Set JAVA_HOME environment variable

4. **Build fails with "Gradle" errors**
   - Clean the project:
     ```bash
     cd android
     ./gradlew clean
     cd ..
     npm run prebuild:clean
     ```

5. **"Permission denied" on macOS/Linux**
   ```bash
   chmod +x build-apk.sh
   ```

### Debug Build Issues

If release build fails, try debug build:
```bash
npm run build:android-debug
```

## 📦 App Configuration

The app is configured with:

- **Package Name**: `com.alcrm.mobile`
- **Version**: `1.0.0`
- **Version Code**: `1`
- **Permissions**: Internet, Storage access

## 🎯 Features Included

- ✅ OTP-based signup with email verification
- ✅ Complete onboarding flow with resume upload
- ✅ Job browsing and application system
- ✅ Profile management with resume handling
- ✅ Mentorship session management
- ✅ Free resources browsing
- ✅ Application tracking
- ✅ Settings and password change

## 📱 Installing the APK

1. **Transfer APK to device**
   - Use USB cable, email, or cloud storage
   - Copy APK to device storage

2. **Enable unknown sources**
   - Go to Settings > Security
   - Enable "Install from unknown sources" or "Unknown apps"

3. **Install APK**
   - Open file manager
   - Navigate to APK location
   - Tap APK file to install

## 🔧 Development Commands

```bash
# Start development server
npm start

# Run on Android device/emulator
npm run android

# Run on iOS device/simulator
npm run ios

# Run on web
npm run web

# Fix all linting and formatting issues
npm run fix:all
```

## 📊 Build Information

- **Framework**: React Native with Expo
- **Architecture**: New Architecture enabled
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: Zustand
- **Navigation**: React Navigation v6
- **HTTP Client**: Axios

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Ensure all prerequisites are installed
3. Try cleaning and rebuilding:
   ```bash
   npm run prebuild:clean
   npm run build:android-debug
   ```

## 📝 Notes

- The debug APK is unsigned and can be installed on any device
- Release APK requires proper signing for distribution
- First build may take longer due to dependency downloads
- Subsequent builds will be faster due to caching

---

**Happy Building! 🚀**
