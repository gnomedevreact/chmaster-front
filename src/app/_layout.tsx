import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';

import '../../global.css';
import { PaperProvider } from 'react-native-paper';
import FlashMessage from 'react-native-flash-message';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import SplashScreenCustom from '@/src/shared/ui/SplashScreenCustom';
import { scheduleDailyNotification } from '@/src/core/notification';
import { useProfileStore } from '@/src/core/lib/store/profile.store';
import { AuthHelpers } from '@/src/shared/lib/helpers/auth.helpers';
import { queryClientUtil } from '@/src/core/queryClient';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    NunitoSans: require('@/src/assets/fonts/NunitoSans_10pt-Regular.ttf'),
    NunitoSansBold: require('@/src/assets/fonts/NunitoSans_10pt-Bold.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const APIKeys = {
  apple: 'appl_yfABHlQRJlkvQYVTRMHjVpuenyP',
  google: 'goog_JPQuCXThfpxujKWvBxfGvupPoXE',
};

function RootLayoutNav() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  const profile = useProfileStore((state) => state.profileData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    (async () => {
      if (profile && profile.blocked) {
        await AuthHelpers.logout();
      }
    })();
  }, [profile]);

  useEffect(() => {
    const setup = async () => {
      const isConfigured = await Purchases.isConfigured();
      if (!isConfigured) {
        if (Platform.OS == 'android') {
          Purchases.configure({ apiKey: APIKeys.google });
        } else {
          Purchases.configure({ apiKey: APIKeys.apple });
        }
      }
    };

    setup();

    console.log('HERE');
    scheduleDailyNotification(profile?.pushToken);
  }, []);

  if (isSplashVisible) {
    return <SplashScreenCustom onFinish={() => setIsSplashVisible(false)} />;
  }

  return (
    <QueryClientProvider client={queryClientUtil}>
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
                <Stack.Screen
                  name="(tabs)"
                  options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen
                  name="videos"
                  options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen
                  name="quiz"
                  options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen name="top" options={{ headerShown: false }} />
                <Stack.Screen name="feed" options={{ headerShown: false }} />
                <Stack.Screen name="plan" options={{ headerShown: false }} />
                <Stack.Screen
                  name="intro"
                  options={{ headerShown: false, gestureEnabled: false }}
                />
              </Stack>
            </SafeAreaView>
          </SafeAreaProvider>
        </PaperProvider>
      </GestureHandlerRootView>
      <FlashMessage
        position="top"
        style={{ zIndex: 9999, elevation: 9999 }}
        floating={true}
      />
    </QueryClientProvider>
  );
}
