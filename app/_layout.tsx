import "@/global.css";
import { useColorScheme } from "@/hooks/util/useColorScheme";

import "@/i18n"; // This line imports the i18n configuration
import { useAppStore } from "@/store/useAppStore";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Toaster } from "sonner-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDBKSRWixVdqQfhVLef_qVbH-TMUZeNot0",
//   authDomain: "urban-tiffin-chef-push-notifcn.firebaseapp.com",
//   projectId: "urban-tiffin-chef-push-notifcn",
//   storageBucket: "urban-tiffin-chef-push-notifcn.appspot.com",
//   messagingSenderId: "316052796113",
//   appId: "1:316052796113:web:c471d0323c45fec9f14bf0",
//   measurementId: "G-M9TBE8PQD4"
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    poppins_regular: require("../assets/fonts/Poppins-Regular.ttf"),
    poppins_medium: require("../assets/fonts/Poppins-Medium.ttf"),
    poppins_semibold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    poppins_bold: require("../assets/fonts/Poppins-Bold.ttf"),
    poppins_extra: require("../assets/fonts/Poppins-ExtraBold.ttf"),
    poppins_black: require("../assets/fonts/Poppins-Black.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const { i18n } = useTranslation();
  const lang = useAppStore((s) => s.lang);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
        <Toaster richColors />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="otp" options={{ headerShown: false }} />
        <Stack.Screen name="(home)" options={{ headerShown: false }} />
        <Stack.Screen name="weekly-orders" options={{ headerShown: false }} />
        <Stack.Screen name="scheduled-menu" options={{ headerShown: false }} />
        <Stack.Screen name="order-history" options={{ headerShown: false }} />
        <Stack.Screen name="meals" options={{ headerShown: false }} />
        <Stack.Screen name="earnings" options={{ headerShown: false }} />
        <Stack.Screen name="banking" options={{ headerShown: false }} />
        <Stack.Screen name="owner-details" options={{ headerShown: false }} />
        <Stack.Screen name="alerts" options={{ headerShown: false }} />
        <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
        <Stack.Screen name="contact-us" options={{ headerShown: false }} />
        <Stack.Screen
          name="terms-conditions"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="advance-settings"
          options={{ headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}
