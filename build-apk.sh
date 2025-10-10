#!/bin/bash

# ALCRM Mobile App - Local APK Build Script
# This script builds the Android APK locally without EAS

set -e

echo "🚀 Starting ALCRM Mobile App Build Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking build requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check Expo CLI
    if ! command -v expo &> /dev/null; then
        print_warning "Expo CLI not found. Installing globally..."
        npm install -g @expo/cli
    fi
    
    # Check Android SDK (optional but recommended)
    if [ -z "$ANDROID_HOME" ]; then
        print_warning "ANDROID_HOME not set. Make sure Android SDK is installed."
    fi
    
    print_success "Requirements check completed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
}

# Run linting and type checking
run_checks() {
    print_status "Running code quality checks..."
    
    # Type check
    print_status "Running TypeScript type check..."
    npm run type-check
    
    # Lint check
    print_status "Running ESLint..."
    npm run lint:check
    
    # Format check
    print_status "Running Prettier format check..."
    npm run format:check
    
    print_success "All checks passed"
}

# Prebuild the project
prebuild_project() {
    print_status "Prebuilding the project..."
    npm run prebuild:clean
    print_success "Project prebuilt successfully"
}

# Build Android APK
build_android() {
    print_status "Building Android APK..."
    
    # Build debug APK first
    print_status "Building debug APK..."
    npm run build:android-debug
    
    print_success "Debug APK built successfully"
    
    # Try to build release APK
    print_status "Building release APK..."
    if npm run build:android; then
        print_success "Release APK built successfully"
    else
        print_warning "Release APK build failed, but debug APK is available"
    fi
}

# Find and display APK location
find_apk() {
    print_status "Locating generated APK files..."
    
    # Look for APK files in common locations
    APK_PATHS=(
        "./android/app/build/outputs/apk/debug/app-debug.apk"
        "./android/app/build/outputs/apk/release/app-release.apk"
        "./android/app/build/outputs/apk/debug/app-debug-unsigned.apk"
        "./android/app/build/outputs/apk/release/app-release-unsigned.apk"
    )
    
    for apk_path in "${APK_PATHS[@]}"; do
        if [ -f "$apk_path" ]; then
            print_success "APK found: $apk_path"
            echo "📱 APK Size: $(du -h "$apk_path" | cut -f1)"
            echo "📁 Full Path: $(realpath "$apk_path")"
        fi
    done
}

# Main build process
main() {
    echo "=========================================="
    echo "🏗️  ALCRM Mobile App - Local Build"
    echo "=========================================="
    
    check_requirements
    install_dependencies
    run_checks
    prebuild_project
    build_android
    find_apk
    
    echo "=========================================="
    print_success "Build process completed!"
    echo "=========================================="
    
    echo ""
    echo "📱 Your APK files are ready!"
    echo "🔍 Look for them in the android/app/build/outputs/apk/ directory"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Install the APK on your Android device"
    echo "   2. Enable 'Install from unknown sources' in device settings"
    echo "   3. Transfer the APK to your device and install"
    echo ""
}

# Run main function
main "$@"
