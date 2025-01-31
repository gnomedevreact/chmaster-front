import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '../../global.css';
import { PaperProvider } from 'react-native-paper';
import FlashMessage from 'react-native-flash-message';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    NunitoSans: require('@/src/assets/fonts/NunitoSans_10pt-Regular.ttf'),
    NunitoSansBold: require('@/src/assets/fonts/NunitoSans_10pt-Bold.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

function RootLayoutNav() {
  const pathname = usePathname();

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     if (pathname === '/auth' && session) {
  //       router.replace('/(tabs)');
  //     }
  //     if (!session) {
  //       router.replace('/auth');
  //     }
  //   });
  // }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <PaperProvider>
          <SafeAreaProvider>
            <SafeAreaView className={'flex-1 bg-[#0F0F0F]'}>
              <Stack
                screenOptions={{ contentStyle: { backgroundColor: '#0F0F0F' } }}
                initialRouteName={'(tabs)'}
              >
                <Stack.Screen
                  name="auth"
                  options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
              </Stack>
              <FlashMessage position="top" />
            </SafeAreaView>
          </SafeAreaProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
