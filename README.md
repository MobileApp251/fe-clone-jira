# Welcome to CloneJira 👋

## 1. Project Overview 📖
### 1.1. Description
This repository contains the Frontend mobile application build with `React Native` and `Expo`. The application provides the user interface, handles user interations and comunicates with backend APIs.
### 1.2. Tech Stack
- Framework: `React Native (Expo)`
- Language: `TypeScript`
- Navigation: `Expo Router`
- State Management: `React Context`
- Authentication: `Google OAuth (Expo AuthSession)`
- Push Notifications: `Expo Notifications (FCM)`
- CI/CD: `GitHub Actions` + `Expo EAS Update`
- Testing: `Jest`
- Monitoring: `Sentry`

## 2. Setup & Installation ⚙️
### 2.1. Installation Steps
```bash
git clone https://github.com/MobileApp251/fe-clone-jira.git
cd fe-clone-jira
npm install
```
### 2.2. Set up Google Authentication
The authentication flow is initiated via a frontend route served by Expo Hosting, which redirects users to `Google OAuth` for authentication.
```bash
npx expo export --platform web
eas deploy --environment production
# When everything is ready, use eas deploy --prod
```

### 2.3. Set up Expo Push Notification
`Expo Push Notification` is used to send real-time notifications to users’ devices, such as task updates, reminders, and system alerts. `Firebase Cloud Messaging (FCM)` is used to deliver push notifications on Android, working behind the scenes with Expo Push Notification. The app registers the device to obtain an Expo Push Token and sends it to the backend, which is used to deliver notifications to the user’s device.

_Detail for setup: https://docs.expo.dev/push-notifications/push-notifications-setup/_

### 2.4. Run the Application
```bash
# Start Expo development server
npx expo start 
```
or
```bash
# Run application on Android emulator/device
npx expo run:android
```

## 3. CI/CD Pipeline 🌌
### 5.1 CI/CD Overview

This frontend project uses `GitHub Actions` to automate:
- Dependency installation
- Running automated tests
- Publishing OTA updates via Expo EAS Update

### 5.2 CI Workflow Location
```bash
.github/workflows/expo-update.yml
```

## 4. Testing 🧪

## 5. Monitoring & Error Tracking 📊
### 5.1. Sentry Integration
- The application integrates `Sentry` for:
- Runtime error tracking
- Performance monitoring
- Session replay

All uncaught errors and crashes are automatically reported to Sentry.

![Sentry](/docs/image.png)

## 6. Security & Secrets 🔐
- Secrets managed via `GitHub Actions Secrets`
- `Expo EAS Secrets` used for build-time variables
- No sensitive information is committed to the repository
- Only push `google-services.json` to EAS to build application