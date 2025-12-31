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
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GoogleAuthProvider>
        {/* <AuthProvider> */}
        <NotificationProvider>
          <GluestackUIProvider mode="dark">
            <ThemeProvider>
              <ProjectsProvider>
                <TasksProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="login" />
                    <Stack.Screen name="onboarding" />
                    <Stack.Screen name="notification" />
                    <Stack.Screen name="profile" />
                  </Stack>
                </TasksProvider>
              </ProjectsProvider>
            </ThemeProvider>
          </GluestackUIProvider>
        </NotificationProvider>
        {/* </AuthProvider> */}
      </GoogleAuthProvider>
    </GestureHandlerRootView>

  );
}