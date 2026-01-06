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

Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
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
}