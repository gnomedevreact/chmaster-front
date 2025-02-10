import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
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
import SplashScreenCustom from '@/src/shared/ui/SplashScreenCustom';
import { Asset } from 'expo-asset';

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

const preloadImages = async () => {
  const images = [
    require('../assets/images/new.png'),
    require('../assets/images/test.webp'),
    require('../assets/images/horse.svg'),
    require('../assets/images/test2.webp'),
    require('../assets/images/horse2.svg'),
  ];
  const cacheImages = images.map((image) => Asset.fromModule(image).downloadAsync());
  return Promise.all(cacheImages);
};

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
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
    if (loaded && isReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isReady]);

  useEffect(() => {
    async function loadAssets() {
      await preloadImages();
      setIsReady(true);
    }
    loadAssets();
  }, []);

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
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const setup = async () => {
      const isConfigured = await Purchases.isConfigured();
      if (!isConfigured) {
        if (Platform.OS == 'android') {
          Purchases.configure({ apiKey: APIKeys.google });
        } else {
          Purchases.configure({ apiKey: APIKeys.apple! });
        }
      }
    };

    setup();
  }, []);

  if (isSplashVisible) {
    return <SplashScreenCustom onFinish={() => setIsSplashVisible(false)} />;
  }

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
                <Stack.Screen name="feed" options={{ headerShown: false }} />
                <Stack.Screen name="plan" options={{ headerShown: false }} />
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
