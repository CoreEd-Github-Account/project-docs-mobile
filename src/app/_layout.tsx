import { Stack } from "expo-router";
import { AuthProvider } from '@/providers/auth-provider';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, ThemeProvider } from 'expo-router/react-navigation';
import { AuthBackground } from '@/components/auth-background';

const navigationTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: 'transparent' },
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider value={navigationTheme}>
        <AuthBackground>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
            <Stack.Screen name="index" options={{ animation: 'fade', animationDuration: 200 }} />
            <Stack.Screen name="signup" options={{ animation: 'fade', animationDuration: 200 }} />
          </Stack>
        </AuthBackground>
      </ThemeProvider>
    </AuthProvider>
  );
}
