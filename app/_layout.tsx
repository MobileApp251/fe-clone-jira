import { Stack } from 'expo-router';
import { ThemeProvider } from './providers/ThemeProvider';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

export default function RootLayout() {
  return (

    <GluestackUIProvider mode="dark">
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="onboarding" />
        </Stack>
      </ThemeProvider>
    </GluestackUIProvider>

  );
}