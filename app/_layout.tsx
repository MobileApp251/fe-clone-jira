import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { ProjectsProvider } from '@/context/ProjectsContext';
import '@/global.css';
import { Stack } from 'expo-router';
import { ThemeProvider } from './providers/ThemeProvider';

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <ThemeProvider>
        <ProjectsProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="notification" />
          </Stack>
        </ProjectsProvider>
      </ThemeProvider>
    </GluestackUIProvider>

  );
}