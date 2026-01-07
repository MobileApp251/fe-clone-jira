import { GoogleAuthProvider } from '@/auth/GoogleAuthContext';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { NotificationProvider } from '@/context/NotificationContext';
import { ProjectsProvider } from '@/context/ProjectsContext';
import { TasksProvider } from '@/context/TasksContext';
import '@/global.css';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from './providers/ThemeProvider';

import * as Notifications from "expo-notifications";
import { useEffect } from 'react';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://8dfcaa52a7bb2d2958eaaef1b739a02a@o4510666818453504.ingest.us.sentry.io/4510666821074944',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default Sentry.wrap(function RootLayout() {
  useEffect(() => {
    Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProjectsProvider>
        <TasksProvider>
          <GoogleAuthProvider>
            {/* <AuthProvider> */}
            <NotificationProvider>
              <GluestackUIProvider mode="dark">
                <ThemeProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="login" />
                    <Stack.Screen name="onboarding" />
                  </Stack>
                </ThemeProvider>
              </GluestackUIProvider>
            </NotificationProvider>
            {/* </AuthProvider> */}
          </GoogleAuthProvider>
        </TasksProvider>
      </ProjectsProvider>
    </GestureHandlerRootView>

  );
});