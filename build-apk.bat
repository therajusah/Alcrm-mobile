@echo off
REM ALCRM Mobile App - Local APK Build Script for Windows
REM This script builds the Android APK locally without EAS

echo 🚀 Starting ALCRM Mobile App Build Process...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo [INFO] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [INFO] Running TypeScript type check...
call npm run type-check
if %errorlevel% neq 0 (
    echo [WARNING] Type check failed, but continuing...
)

echo [INFO] Running ESLint...
call npm run lint:check
if %errorlevel% neq 0 (
    echo [WARNING] Lint check failed, but continuing...
)

echo [INFO] Running Prettier format check...
call npm run format:check
if %errorlevel% neq 0 (
    echo [WARNING] Format check failed, but continuing...
)

echo [INFO] Prebuilding the project...
call npm run prebuild:clean
if %errorlevel% neq 0 (
    echo [ERROR] Failed to prebuild project
    pause
    exit /b 1
)

echo [INFO] Building Android APK...
call npm run build:android-debug
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build Android APK
    pause
    exit /b 1
)

echo [SUCCESS] Build process completed!
echo.
echo 📱 Your APK files are ready!
echo 🔍 Look for them in the android\app\build\outputs\apk\ directory
echo.
echo 📋 Next steps:
echo    1. Install the APK on your Android device
echo    2. Enable 'Install from unknown sources' in device settings
echo    3. Transfer the APK to your device and install
echo.
pause
