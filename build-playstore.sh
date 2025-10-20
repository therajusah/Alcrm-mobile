#!/bin/bash

# Alcrm - Optimized Play Store Build Script
# This script builds an optimized Android APK for Play Store with reduced size

set -e

echo "🚀 Starting Alcrm - Optimized Play Store Build..."

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
    
    # Check EAS CLI
    if ! command -v eas &> /dev/null; then
        print_warning "EAS CLI not found. Installing globally..."
        npm install -g eas-cli
    fi
    
    print_success "Requirements check completed"
}

# Clean and optimize project
optimize_project() {
    print_status "Optimizing project for Play Store build..."
    
    # Clean node_modules and reinstall
    print_status "Cleaning and reinstalling dependencies..."
    rm -rf node_modules
    npm install --production=false
    
    # Clean Expo cache
    print_status "Cleaning Expo cache..."
    expo install --fix
    
    # Remove unnecessary files
    print_status "Removing unnecessary files..."
    find . -name "*.log" -delete
    find . -name ".DS_Store" -delete
    find . -name "Thumbs.db" -delete
    
    print_success "Project optimization completed"
}

# Create EAS build configuration
create_eas_config() {
    print_status "Creating EAS build configuration..."
    
    cat > eas.json << 'EOF'
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab",
        "gradleCommand": ":app:bundleRelease"
      },
      "ios": {
        "buildType": "archive"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
EOF
    
    print_success "EAS configuration created"
}

# Build optimized APK using EAS
build_optimized_apk() {
    print_status "Building optimized APK for Play Store..."
    
    # Login to EAS (if not already logged in)
    print_status "Checking EAS authentication..."
    if ! eas whoami &> /dev/null; then
        print_warning "Please login to EAS:"
        eas login
    fi
    
    # Build preview APK (optimized for size)
    print_status "Building optimized preview APK..."
    eas build --platform android --profile preview --non-interactive
    
    print_success "Optimized APK build completed"
}

# Build AAB for Play Store
build_play_store_aab() {
    print_status "Building Android App Bundle (AAB) for Play Store..."
    
    # Build production AAB
    print_status "Building production AAB..."
    eas build --platform android --profile production --non-interactive
    
    print_success "Play Store AAB build completed"
}

# Show build results
show_build_results() {
    print_status "Build results:"
    
    echo ""
    echo "📱 Build completed successfully!"
    echo ""
    echo "🔍 Check your builds at: https://expo.dev/accounts/[your-username]/projects/alcrm-mobile-app/builds"
    echo ""
    echo "📋 Next steps for Play Store:"
    echo "   1. Download the AAB file from the EAS build page"
    echo "   2. Upload the AAB to Google Play Console"
    echo "   3. Complete the Play Store listing"
    echo "   4. Submit for review"
    echo ""
    echo "💡 Tips for Play Store:"
    echo "   - AAB files are smaller than APK files"
    echo "   - Google Play generates optimized APKs for each device"
    echo "   - Use the preview APK for testing before uploading AAB"
    echo ""
}

# Main build process
main() {
    echo "=========================================="
    echo "🏗️  Alcrm - Play Store Build"
    echo "=========================================="
    
    check_requirements
    optimize_project
    create_eas_config
    build_optimized_apk
    build_play_store_aab
    show_build_results
    
    echo "=========================================="
    print_success "Play Store build process completed!"
    echo "=========================================="
}

# Run main function
main "$@"
