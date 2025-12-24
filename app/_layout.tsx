import { AuthProvider } from '@/auth/AuthContext';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { ProjectsProvider } from '@/context/ProjectsContext';
import { TasksProvider } from '@/context/TasksContext';
import '@/global.css';
import { Stack } from 'expo-router';
import { ThemeProvider } from './providers/ThemeProvider';

export default function RootLayout() {
  return (
    <AuthProvider>
      <GluestackUIProvider mode="dark">
        <ThemeProvider>
          <ProjectsProvider>
            <TasksProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="notification" />
              </Stack>
            </TasksProvider>
          </ProjectsProvider>
        </ThemeProvider>
      </GluestackUIProvider>
    </AuthProvider>
  );
}