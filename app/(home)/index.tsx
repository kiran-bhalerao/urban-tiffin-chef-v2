import SafeScreen from "@/components/molecules/SafeScreen";
import { Text } from "@/components/ui/text";
import { useDashboard } from "@/hooks/apis/useDashboard";
import { useGetKitchenConfig } from "@/hooks/apis/useGetKitchenConfig";
import { useUpdateKitchenConfig } from "@/hooks/apis/useUpdateKitchenConfig";
import { useQueryRefresh } from "@/hooks/util/useQueryRefresh";
import { formateFullDate } from "@/lib/formate_full_date";
import { useAppStore } from "@/store/useAppStore";
import { router } from "expo-router";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  Moon,
  Sun,
  SunMoon,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import { toast } from "sonner-native";

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
});

export default function TabHomeScreen() {
  const [isEnabled, setIsEnabled] = useState(true);

  const {
    t,
    i18n: { language },
  } = useTranslation();
  const name = useAppStore((s) => s.user?.name);
  const kitchenId = useAppStore((s) => s.user?.kitchen?._id);

  const { data: kitchenConfig } = useGetKitchenConfig(kitchenId);
  useEffect(() => {
    if (kitchenConfig?.data.acceptingOrders !== undefined) {
      setIsEnabled(kitchenConfig?.data.acceptingOrders);
    }
  }, [kitchenConfig?.data.acceptingOrders]);

  const { data } = useDashboard(kitchenId);
  const { mutate } = useUpdateKitchenConfig({
    onError(error, { acceptingOrders }) {
      toast.error(error);
      setIsEnabled(!acceptingOrders);
    },
    onSuccess({ message }) {
      toast.success(message);
    },
  });

  const toggleSwitch = () => {
    if (isEnabled) {
      Alert.alert(t("home.close_kitchen"), t("home.close_kitchen_info"), [
        {
          text: t("home.cancel"),
          style: "cancel",
        },
        {
          text: t("home.yes"),
          onPress: () => {
            if (kitchenId) {
              setIsEnabled(false);
              mutate({ kitchenId, acceptingOrders: false });
            }
          },
        },
      ]);
    } else {
      if (kitchenId) {
        setIsEnabled(true);
        mutate({ kitchenId, acceptingOrders: true });
      }
    }
  };

  const { refreshing, onRefresh } = useQueryRefresh();

  return (
    <SafeScreen onlyTop>
      <View className="mb-2 flex-row justify-between">
        <View>
          <Text className="text-2xl capitalize font-poppins_semibold">
            Hello {name || "User"},
          </Text>
          <Text className="text-base text-gray-500">{t("home.heading")}</Text>
        </View>
        <View>
          <Pressable
            onPress={() => router.navigate("/alerts")}
            className="px-1.5 py-1"
          >
            <Bell color="#2B2B2B" size={20} />
          </Pressable>
        </View>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        automaticallyAdjustKeyboardInsets
      >
        <View className="flex-row justify-between items-center bg-white px-3 py-3 mb-3 rounded-xl">
          <View className="flex-row items-center">
            <View className="ml-2 ">
              <Text className="text-brand-dark-gray text-base font-poppins_semibold">
                {isEnabled
                  ? t("home.today_kitchen_on")
                  : t("home.today_kitchen_off")}
              </Text>
              <View className="flex-row items-center">
                <CalendarDays color="#676767" size={16} />
                <Text className="text-brand-dark-gray ml-2 text-sm font-poppins_regular">
                  {formateFullDate(undefined, language, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    weekday: "long",
                  })}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-row gap-2 items-center">
            <Switch
              trackColor={{ false: "#767577", true: "#ffa92261" }}
              thumbColor={isEnabled ? "#FFA922" : "#f4f3f4"}
              ios_backgroundColor="#ffa92261"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
        <View className="mb-3 rounded-3xl bg-white">
          <View className="p-5 bg-brand/60 rounded-t-3xl items-center justify-center">
            <Text className="text-center uppercase text-lg font-poppins_medium text-gray-700">
              {t("home.weekly_orders")}
            </Text>
          </View>
          <View className="bg-white rounded-lg p-6">
            <Text className="text-center text-4xl font-poppins_bold">
              {data?.data.orderStatus.totalOrders}
            </Text>
            <Text className="text-center uppercase font-poppins_medium text-base text-gray-500 mt-2">
              {t("home.total_orders")}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <View className="flex-1 bg-brand/10 py-4 rounded-bl-3xl">
              <Text className="text-center text-2xl font-poppins_bold">
                {data?.data.orderStatus.processingOrders}
              </Text>
              <Text className="text-center uppercase text-gray-500 font-poppins_medium text-base">
                {t("home.today")}
              </Text>
            </View>
            <View className="flex-1 bg-brand/20 py-4 rounded-br-3xl">
              <Text className="text-center text-2xl font-poppins_bold">
                {data?.data.orderStatus.deliveredOrders}
              </Text>
              <Text className="text-center uppercase text-gray-500 font-poppins_medium text-base">
                {t("home.delivered")}
              </Text>
            </View>
          </View>
        </View>
        <Pressable
          onPress={() =>
            router.navigate({
              pathname: "/weekly-orders",
              params: { mealTime: "breakfast" },
            })
          }
          className="flex-row justify-between items-center bg-white px-4 py-6 mb-2 rounded-xl"
        >
          <View className="flex-row items-center">
            <SunMoon color="#676767" size={22} />
            <Text className="text-brand-dark-gray ml-2 text-base">
              {t("home.breakfast_orders")}
            </Text>
          </View>
          <View className="flex-row gap-2 items-center">
            <Text className="text-center text-xl font-poppins_bold">
              {data?.data.allOrders.breakfast}
            </Text>
            <ChevronRight color="#676767" size={20} />
          </View>
        </Pressable>
        <Pressable
          onPress={() =>
            router.navigate({
              pathname: "/weekly-orders",
              params: { mealTime: "lunch" },
            })
          }
          className="flex-row justify-between items-center bg-white px-4 py-6 mb-2 rounded-xl"
        >
          <View className="flex-row items-center">
            <Sun color="#676767" size={22} />
            <Text className="text-brand-dark-gray ml-2 text-base">
              {t("home.lunch_orders")}
            </Text>
          </View>
          <View className="flex-row gap-2 items-center">
            <Text className="text-center text-xl font-poppins_bold">
              {data?.data.allOrders.lunch}
            </Text>
            <ChevronRight color="#676767" size={20} />
          </View>
        </Pressable>
        <Pressable
          onPress={() =>
            router.navigate({
              pathname: "/weekly-orders",
              params: { mealTime: "dinner" },
            })
          }
          className="flex-row justify-between items-center bg-white px-4 py-6 mb-2 rounded-xl"
        >
          <View className="flex-row items-center">
            <Moon color="#676767" size={22} />
            <Text className="text-brand-dark-gray ml-2 text-base">
              {t("home.dinner_orders")}
            </Text>
          </View>
          <View className="flex-row gap-2 items-center">
            <Text className="text-center text-xl font-poppins_bold">
              {data?.data.allOrders.dinner}
            </Text>
            <ChevronRight color="#676767" size={20} />
          </View>
        </Pressable>
      </ScrollView>
    </SafeScreen>
  );
}
