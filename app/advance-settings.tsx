import SafeScreen from "@/components/molecules/SafeScreen";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAppStore } from "@/store/useAppStore";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  ArrowLeft,
  ChevronRight,
  GlobeLock,
  LogOut,
  MonitorSmartphone,
  ReceiptText,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
});

export default function AdvanceSettings() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const logout = useAppStore((s) => s.logout);

  const onLogout = () => {
    Alert.alert(t("kitchen.logout"), t("kitchen.logout_alert"), [
      {
        text: t("kitchen.cancel"),
        style: "cancel",
      },
      {
        text: t("kitchen.yes"),
        onPress: () => {
          queryClient.clear();
          logout();
          router.dismissAll();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <SafeScreen>
      <View className="flex-row items-center">
        <Button
          className="!px-2 mb-0.5 !h-6"
          variant="ghost"
          onPress={() => router.back()}
        >
          <ArrowLeft color="#000000" />
        </Button>
        <Text className="text-2xl font-poppins_semibold text-gray-800 ml-2">
          {t("advance_settings.advance_settings")}
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        className="flex-1"
      >
        <View className="gap-1.5 mt-1 flex-1">
          <Pressable
            onPress={() => router.navigate("/contact-us")}
            className="flex-row justify-between items-center bg-white px-5 py-4 rounded-xl"
          >
            <View className="flex-row items-center">
              <MonitorSmartphone color="#676767" size={20} />
              <Text className="text-brand-dark-gray ml-2 text-[15px]">
                {t("kitchen.contact_us")}
              </Text>
            </View>
            <ChevronRight color="#676767" size={20} />
          </Pressable>
          <Pressable
            onPress={() => router.navigate("/privacy-policy")}
            className="flex-row justify-between items-center bg-white px-5 py-4 rounded-xl"
          >
            <View className="flex-row items-center">
              <GlobeLock color="#676767" size={20} />
              <Text className="text-brand-dark-gray ml-2 text-[15px]">
                {t("kitchen.privacy_policy")}
              </Text>
            </View>
            <ChevronRight color="#676767" size={20} />
          </Pressable>
          <Pressable
            onPress={() => router.navigate("/terms-conditions")}
            className="flex-row justify-between items-center bg-white px-5 py-4 rounded-xl"
          >
            <View className="flex-row items-center">
              <ReceiptText color="#676767" size={20} />
              <Text className="text-brand-dark-gray ml-2 text-[15px]">
                {t("kitchen.terms_conditions")}
              </Text>
            </View>
            <ChevronRight color="#676767" size={20} />
          </Pressable>
          <Pressable
            onPress={onLogout}
            className="flex-row justify-between items-center bg-white px-5 py-4 rounded-xl"
          >
            <View className="flex-row items-center">
              <LogOut color="#D12D2D" size={20} />
              <Text className="text-brand-red ml-2 text-[15px]">
                {t("kitchen.logout")}
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
