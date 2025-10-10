# ALCRM Mobile App - Quick Setup Guide

This guide will help you get the ALCRM Mobile App up and running quickly.

## Prerequisites

- Node.js 16+ installed
- npm or yarn installed
- Expo CLI installed globally: `npm install -g expo-cli`
- Your ALCRM backend running

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
cd mobile/alcrm-mobile-app
npm install
```

### 2. Configure Backend URL

**Option A: For Testing on iOS Simulator**
Edit `src/config/api.ts`:
```typescript
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:4000/api'
  : 'https://your-production-api.com/api';
```

**Option B: For Testing on Physical Device**
Find your computer's IP address:
- Mac: System Preferences → Network → Look for "IP Address"
- Windows: Run `ipconfig` in command prompt
- Linux: Run `ifconfig` or `ip addr`

Then edit `src/config/api.ts`:
```typescript
export const API_BASE_URL = __DEV__ 
  ? 'http://192.168.1.XXX:4000/api'  // Replace with your IP
  : 'https://your-production-api.com/api';
```

### 3. Start the Backend

In a separate terminal:
```bash
cd alcrm-backend
npm run dev
```

The backend should start on `http://localhost:4000`

### 4. Start the Mobile App

```bash
npm start
```

This opens Expo DevTools in your browser.

### 5. Run on Device

**iOS Simulator:**
- Press `i` in the terminal
- Or run: `npm run ios`

**Android Emulator:**
- Press `a` in the terminal
- Or run: `npm run android`

**Physical Device:**
1. Install "Expo Go" app from App Store or Play Store
2. Scan QR code from terminal/browser
3. Make sure phone and computer are on same WiFi

## Testing the App

### Test Credentials

Use your existing ALCRM user account, or create a new one:

1. Open the app
2. Tap "Sign Up"
3. Enter your email
4. Check email for OTP
5. Complete signup
6. Login and explore!

### Test Features

✅ **Authentication**
- Login/Signup
- Forgot Password
- OTP verification

✅ **Dashboard**
- View recent jobs
- Quick actions

✅ **Jobs**
- Browse jobs
- Search jobs
- View job details
- Apply for jobs

✅ **Applications**
- View all applications
- Check status

✅ **Resources**
- Browse free resources
- Open resource links

✅ **Profile**
- Edit profile info
- Update details
- Change password
- Logout

## Common Issues & Solutions

### "Cannot connect to backend"

**Solution:**
1. Make sure backend is running: `cd alcrm-backend && npm run dev`
2. Check the API URL in `src/config/api.ts`
3. For physical device, use your computer's IP address
4. Check firewall settings

### "Network request failed"

**Solution:**
1. Ensure phone and computer are on same WiFi
2. Update API URL to use your IP instead of localhost
3. Disable VPN if active

### "Expo Go app won't connect"

**Solution:**
1. Make sure you're on the same WiFi network
2. Try restarting Expo: Press `r` in terminal
3. Restart Expo Go app on your phone

### TypeScript errors

**Solution:**
```bash
npm run type-check
```

### Clear cache and restart

**Solution:**
```bash
expo start --clear
```

## Project Structure Overview

```
src/
├── components/       # Reusable UI components
├── config/          # API configuration
├── navigation/      # Navigation setup
├── screens/         # App screens (auth & user)
├── services/        # API services
├── stores/          # State management (Zustand)
├── styles/          # Global styles
└── types/           # TypeScript types
```

## Key Files to Know

- `src/config/api.ts` - API endpoints and base URL
- `src/services/api.ts` - API service methods
- `src/stores/authStore.ts` - Authentication state
- `src/navigation/AppNavigator.tsx` - Navigation structure
- `tailwind.config.js` - Styling configuration

## Development Tips

### Hot Reload
- Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android) for dev menu
- Enable "Fast Refresh" for instant updates

### Debugging
- Press `j` in terminal to open debugger
- Use `console.log()` statements
- Check Expo logs in terminal

### Testing Different Users
- Create multiple test accounts
- Test different user roles (only user role in mobile app)

## Next Steps

1. ✅ Test all authentication flows
2. ✅ Browse and apply for test jobs
3. ✅ Update your profile information
4. ✅ Explore all features
5. 🚀 Ready for production? See README.md for build instructions

## Need Help?

1. Check the main README.md for detailed documentation
2. Review backend API at `http://localhost:4000/api`
3. Check Expo documentation: https://docs.expo.dev/

---

**You're all set! Enjoy using ALCRM Mobile! 📱**


