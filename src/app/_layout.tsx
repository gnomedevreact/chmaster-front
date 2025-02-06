import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
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
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import { useProfileStore } from '@/src/core/lib/store/profile.store';

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

const APIKeys = {
  apple: 'appl_yfABHlQRJlkvQYVTRMHjVpuenyP',
  google: 's',
};

function RootLayoutNav() {
  const profile = useProfileStore((state) => state.profileData);

  useEffect(() => {
    const setup = () => {
      if (profile) {
        if (Platform.OS == 'android') {
          Purchases.configure({ apiKey: APIKeys.google });
        } else {
          Purchases.configure({ apiKey: APIKeys.apple!, appUserID: profile.id });
        }
      }
    };
    setup();
  }, []);

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
                <Stack.Screen
                  name="videos"
                  options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen
                  name="quiz"
                  options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen name="top" options={{ headerShown: false }} />
              </Stack>
              <FlashMessage position="top" />
            </SafeAreaView>
          </SafeAreaProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
