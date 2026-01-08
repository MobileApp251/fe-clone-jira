# Welcome to CloneJira 👋
![CloneJira](/docs/icon.png)

![React Native](https://img.shields.io/badge/React%20Native-20232A?style=flat&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)
![Google Auth](https://img.shields.io/badge/Google%20OAuth-4285F4?style=flat&logo=google&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white)

## 1. Project Overview 📖
### 1.1. Description
This repository contains the Frontend mobile application build with `React Native` and `Expo`. The application provides the user interface, handles Ưuser interations and comunicates with backend APIs.
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
![Test Result](/docs/noti.png)

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
- Running `automated tests`
- `Publishing OTA updates` via Expo EAS Update

### 5.2 CI Workflow Location
```bash
.github/workflows/expo-update.yml
```
and
```bash
.github/workflows/test.yml
```

## 4. Testing 🧪
To ensure the mobile application operates correctly and provides a stable user experience, the development team conducted unit and component testing using `Jest`. The testing process focused on verifying core functionalities, user interactions, and edge cases across major screens and components of the application.

`Automated tests` were implemented to reduce potential bugs, improve code reliability, and support maintainability during future development and feature expansion.

📊 Test Coverage Results
![Test Result](/docs/test-result.png)

The test coverage results are summarized as follows:
- `Statements: 75.3% (625 / 830)`
- `Branches: 75.41% (227 / 301)`
- `Functions: 73.7% (199 / 270)`
- `Lines: 76.02% (612 / 805)`

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