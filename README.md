# ALCRM Mobile App

A complete React Native mobile application for ALCRM users, built with Expo, TypeScript, NativeWind, and Zustand.

## 📱 Features

- **Authentication**
  - User login with email/password
  - Sign up with email verification (OTP)
  - Forgot password with email OTP reset
  - Secure token-based authentication

- **Dashboard**
  - Welcome screen with personalized greeting
  - Quick actions for browsing jobs and applications
  - Recent job postings overview

- **Jobs**
  - Browse all available job listings
  - Search and filter jobs
  - View detailed job information
  - Apply for jobs with cover letter
  - Track application status

- **Applications**
  - View all submitted applications
  - Track application status
  - See application history

- **Free Resources**
  - Access educational materials
  - View PDFs, videos, articles, and courses
  - Open external resource links

- **Profile & Settings**
  - View and edit personal information
  - Update profile details
  - Change password
  - Logout functionality

## 🛠 Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand
- **Navigation**: React Navigation v6
- **HTTP Client**: Axios
- **Storage**: AsyncStorage

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS: Xcode (Mac only)
- For Android: Android Studio

## 🚀 Installation

### 1. Navigate to the mobile app directory

```bash
cd mobile/alcrm-mobile-app
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure API endpoint

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and update the `API_BASE_URL`:

**For iOS Simulator:**
```
API_BASE_URL=http://localhost:4000/api
```

**For Android Emulator:**
```
API_BASE_URL=http://10.0.2.2:4000/api
```

**For Physical Device:**
```
API_BASE_URL=http://YOUR_COMPUTER_IP:4000/api
```
Replace `YOUR_COMPUTER_IP` with your actual local IP address (e.g., 192.168.1.100)

### 4. Update API configuration

Open `src/config/api.ts` and update the `API_BASE_URL` to match your backend:

```typescript
export const API_BASE_URL = __DEV__ 
  ? 'http://YOUR_IP:4000/api'  // For development
  : 'https://your-production-api.com/api';  // For production
```

## 📱 Running the App

### Start Expo development server

```bash
npm start
# or
expo start
```

This will open the Expo DevTools in your browser.

### Run on iOS Simulator

```bash
npm run ios
# or
expo run:ios
```

### Run on Android Emulator

```bash
npm run android
# or
expo run:android
```

### Run on Physical Device

1. Install the "Expo Go" app from App Store (iOS) or Google Play Store (Android)
2. Scan the QR code from the Expo DevTools
3. Make sure your phone and computer are on the same WiFi network

## 🔧 Configuration

### Backend API

The app connects to your existing ALCRM backend. Make sure your backend is running and accessible:

```bash
# In the backend directory
cd ../../alcrm-backend
npm run dev
```

The backend should be running on `http://localhost:4000`

### API Endpoints

The app uses the following API endpoints (defined in `src/config/api.ts`):

**Auth:**
- POST `/auth/signup`
- POST `/auth/signin`
- POST `/auth/signout`
- GET `/auth/profile`
- POST `/auth/validate-token`
- POST `/auth/otp/request`
- POST `/auth/otp/verify`
- POST `/auth/password/otp/request`
- POST `/auth/password/otp/verify`
- POST `/auth/password/reset`

**User:**
- GET `/user/profile`
- PATCH `/user/profile`
- GET `/user/jobs`
- GET `/user/jobs/:id`
- POST `/user/jobs/:id/apply`
- GET `/user/applications`
- GET `/user/resources`
- GET `/user/resources/:id`

## 📁 Project Structure

```
alcrm-mobile-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── EmptyState.tsx
│   ├── config/              # App configuration
│   │   └── api.ts
│   ├── navigation/          # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── screens/             # App screens
│   │   ├── auth/            # Authentication screens
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignupScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   └── user/            # User screens
│   │       ├── DashboardScreen.tsx
│   │       ├── JobsScreen.tsx
│   │       ├── JobDetailScreen.tsx
│   │       ├── ApplicationsScreen.tsx
│   │       ├── ResourcesScreen.tsx
│   │       ├── ProfileScreen.tsx
│   │       ├── SettingsScreen.tsx
│   │       └── ChangePasswordScreen.tsx
│   ├── services/            # API services
│   │   └── api.ts
│   ├── stores/              # Zustand stores
│   │   ├── authStore.ts
│   │   ├── jobStore.ts
│   │   ├── applicationStore.ts
│   │   └── resourceStore.ts
│   ├── styles/              # Global styles
│   │   └── global.css
│   └── types/               # TypeScript types
│       └── index.ts
├── App.tsx                  # Main app component
├── app.json                 # Expo configuration
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md                # This file
```

## 🎨 Styling

The app uses NativeWind (Tailwind CSS for React Native) for styling. You can customize the theme in `tailwind.config.js`.

Example:
```typescript
// Component with Tailwind classes
<View className="bg-white p-4 rounded-lg shadow-md">
  <Text className="text-lg font-bold text-gray-900">Hello World</Text>
</View>
```

## 🔐 Authentication Flow

1. User opens app → Check for stored auth token
2. If no token → Show Login/Signup screens
3. User logs in → Token stored in AsyncStorage
4. Token included in all API requests via Axios interceptor
5. User logs out → Token removed from AsyncStorage

## 📦 State Management

The app uses Zustand for state management with the following stores:

- **authStore**: User authentication and profile
- **jobStore**: Job listings and details
- **applicationStore**: User applications
- **resourceStore**: Free resources

Example usage:
```typescript
import { useAuthStore } from '../stores/authStore';

function MyComponent() {
  const { user, login, logout } = useAuthStore();
  // Use state and actions
}
```

## 🧭 Navigation

The app uses React Navigation v6 with:
- Stack Navigator for auth flow
- Bottom Tab Navigator for main app screens
- Nested navigators for complex flows

## 🐛 Troubleshooting

### Cannot connect to backend

1. Make sure backend is running on correct port
2. Check your firewall settings
3. For physical devices, ensure same WiFi network
4. Try using your computer's IP address instead of localhost

### Build errors

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
expo start --clear
```

### iOS issues

```bash
cd ios
pod install
cd ..
```

### Android issues

```bash
cd android
./gradlew clean
cd ..
```

## 📝 Development Notes

### Adding new screens

1. Create screen component in `src/screens/`
2. Add route in `src/navigation/AppNavigator.tsx`
3. Add navigation types if needed

### Adding new API endpoints

1. Add endpoint to `src/config/api.ts`
2. Add API method to `src/services/api.ts`
3. Update types in `src/types/index.ts`

### Adding new state

1. Create store in `src/stores/`
2. Define state interface and actions
3. Use in components with `useStore()` hook

## 🚢 Building for Production

### iOS

```bash
expo build:ios
```

### Android

```bash
expo build:android
```

### EAS Build (Recommended)

```bash
npm install -g eas-cli
eas login
eas build --platform all
```

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [NativeWind](https://www.nativewind.dev/)
- [Zustand](https://github.com/pmndrs/zustand)

## 👥 For Users

This mobile app is designed for **users only** (not admin or recruiter roles). Features include:
- Browse and apply for jobs
- Track application status
- Access free resources
- Manage profile and settings

## 🤝 Support

For issues or questions:
1. Check this README
2. Review the backend API documentation
3. Check Expo logs: `expo start --clear`

## 📄 License

This project is part of the ALCRM system.

---

**Happy Coding! 🚀**


