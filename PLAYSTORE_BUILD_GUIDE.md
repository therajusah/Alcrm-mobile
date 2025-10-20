# Alcrm - Optimized Play Store Build Guide

This guide will help you build an optimized Android APK/AAB for the Google Play Store with reduced file size.

## 🚀 Quick Start

### Option 1: Automated Build (Recommended)
```bash
./build-playstore.sh
```

### Option 2: Manual Build Steps
```bash
# 1. Install EAS CLI
npm install -g @expo/eas-cli

# 2. Login to EAS
eas login

# 3. Build for Play Store (AAB)
npm run build:playstore

# 4. Build Preview APK (for testing)
npm run build:preview
```

## 📱 Build Types

### 1. Android App Bundle (AAB) - For Play Store
- **Command**: `npm run build:playstore`
- **Output**: `.aab` file
- **Size**: Smaller than APK
- **Use**: Upload to Google Play Console

### 2. Preview APK - For Testing
- **Command**: `npm run build:preview`
- **Output**: `.apk` file
- **Size**: Optimized but larger than AAB
- **Use**: Testing before Play Store upload

## 🔧 Optimization Features

### Build Optimizations
- ✅ **R8 Full Mode**: Advanced code shrinking and obfuscation
- ✅ **Resource Shrinking**: Removes unused resources
- ✅ **PNG Crunching**: Compresses PNG images
- ✅ **Zip Alignment**: Optimizes APK structure
- ✅ **ProGuard Rules**: Custom optimization rules
- ✅ **Multi-dex**: Handles large method counts

### Size Reduction Techniques
- ✅ **Tree Shaking**: Removes unused code
- ✅ **Dead Code Elimination**: Removes unreachable code
- ✅ **Asset Optimization**: Compresses images and assets
- ✅ **Log Removal**: Strips console logs in production
- ✅ **Debug Info Removal**: Removes debug information

## 📋 Prerequisites

### Required Tools
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- EAS CLI (`npm install -g @expo/eas-cli`)

### EAS Account Setup
1. Create account at [expo.dev](https://expo.dev)
2. Login: `eas login`
3. Configure project: `eas build:configure`

## 🏗️ Build Process

### 1. Project Optimization
- Cleans node_modules and reinstalls dependencies
- Removes unnecessary files (logs, cache, etc.)
- Optimizes asset bundle patterns

### 2. EAS Configuration
- Creates `eas.json` with optimized build profiles
- Configures production and preview builds
- Sets up Android App Bundle (AAB) for Play Store

### 3. Android Build Configuration
- Enables R8 full mode for better optimization
- Configures ProGuard rules for React Native
- Sets up resource shrinking and PNG crunching
- Enables multi-dex support

### 4. Build Execution
- Builds optimized AAB for Play Store
- Builds preview APK for testing
- Provides download links and next steps

## 📊 Expected Results

### File Sizes (Approximate)
- **Debug APK**: ~50-80 MB
- **Release APK**: ~25-40 MB
- **AAB (Play Store)**: ~20-35 MB

### Size Reduction
- **Code Shrinking**: 30-50% reduction
- **Resource Optimization**: 20-30% reduction
- **Asset Compression**: 15-25% reduction

## 🎯 Play Store Upload

### 1. Download AAB
- Go to [expo.dev builds](https://expo.dev/accounts/[username]/projects/alcrm-mobile-app/builds)
- Download the production AAB file

### 2. Upload to Play Console
- Go to [Google Play Console](https://play.google.com/console)
- Navigate to your app
- Go to "Release" → "Production"
- Upload the AAB file

### 3. Complete Listing
- Add app description, screenshots, etc.
- Set up pricing and distribution
- Submit for review

## 🔍 Troubleshooting

### Common Issues

#### Build Fails
```bash
# Clean and retry
expo prebuild --clean
eas build --platform android --profile production --clear-cache
```

#### Large APK Size
- Check for unused dependencies
- Optimize images and assets
- Enable more aggressive ProGuard rules

#### EAS Authentication Issues
```bash
# Re-login to EAS
eas logout
eas login
```

### Performance Tips
- Use `expo install --fix` to resolve dependency issues
- Remove unused assets from `assets/` folder
- Optimize images before adding to project
- Use vector icons instead of PNG icons when possible

## 📈 Monitoring

### Build Status
- Check builds at: `https://expo.dev/accounts/[username]/projects/alcrm-mobile-app/builds`
- Monitor build logs for optimization results
- Track APK/AAB size over time

### Play Store Analytics
- Monitor app size in Play Console
- Track download performance
- Analyze user feedback on app size

## 🎉 Success!

Once your optimized build is uploaded to the Play Store:
- ✅ Smaller download size for users
- ✅ Faster installation
- ✅ Better Play Store ranking
- ✅ Improved user experience

---

**Need Help?**
- Check [Expo Documentation](https://docs.expo.dev/)
- Visit [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- Join [Expo Discord](https://chat.expo.dev/)
