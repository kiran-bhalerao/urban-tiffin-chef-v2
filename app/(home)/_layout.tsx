import { useChefDetails } from "@/hooks/apis/useChefDetails";
import { useAppStore } from "@/store/useAppStore";
import { Tabs } from "expo-router";
import { ChefHat, Home, Wallet } from "lucide-react-native";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function HomeLayout() {
  const { t } = useTranslation();
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);

  // refresh stored chef/kitchen data
  const { data } = useChefDetails(user);
  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  // const checkApplicationPermission = async () => {
  //   try {
  //     if (Platform.OS === "android") {
  //       await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  //       );
  //     } else if (Platform.OS === "ios") {
  //       await messaging().requestPermission();
  //     }
  //   } catch (error) {
  //     // Ignore
  //   }
  // };

  // useEffect(() => void checkApplicationPermission(), []);
  // useFcmSetup();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2F2F2F",
        tabBarInactiveTintColor: "#ABABAB",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tab.home"),
          tabBarIcon(props) {
            return <Home {...props} />;
          },
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: t("tab.wallet"),
          tabBarIcon(props) {
            return <Wallet {...props} />;
          },
        }}
      />
      <Tabs.Screen
        name="kitchen"
        options={{
          title: t("tab.kitchen"),
          tabBarIcon(props) {
            return <ChefHat {...props} />;
          },
        }}
      />
    </Tabs>
  );
}
