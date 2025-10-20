import SafeScreen from "@/components/molecules/SafeScreen";
import { Text } from "@/components/ui/text";
import { useDashboard } from "@/hooks/apis/useDashboard";
import { useGetKitchenConfig } from "@/hooks/apis/useGetKitchenConfig";
import { useUpdateKitchenConfig } from "@/hooks/apis/useUpdateKitchenConfig";
import { useQueryRefresh } from "@/hooks/util/useQueryRefresh";
import { formateFullDate } from "@/lib/formate_full_date";
import { useAppStore } from "@/store/useAppStore";
import { router } from "expo-router";
import { Bell, CalendarDays, ChevronRight, Moon, Sun, SunMoon } from "lucide-react-native";
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
      <View className="mb-6 flex-row justify-between">
        <View>
          <Text className="text-3xl capitalize font-poppins_semibold">
            Hello {name || "User"},
          </Text>
          <Text className="text-lg text-gray-500 mt-1">
            {t("home.heading")}
          </Text>
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
        <View className="bg-white border border-gray-200 px-6 py-6 mb-6 rounded-3xl">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <View className="flex-row items-center mb-3">
                <View className={`w-3 h-3 rounded-full mr-3 ${isEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
                <Text className="text-gray-900 text-xl font-poppins_bold">
                  {isEnabled
                    ? t("home.today_kitchen_on")
                    : t("home.today_kitchen_off")}
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="p-3 rounded-2xl bg-blue-50 border border-blue-100 mr-4">
                  <CalendarDays color="#3B82F6" size={24} />
                </View>
                <View>
                  <Text className="text-gray-900 text-lg font-poppins_semibold">
                    {formateFullDate(undefined, language, {
                      weekday: "long",
                    })}
                  </Text>
                  <Text className="text-gray-600 text-base font-poppins_medium mt-0.5">
                    {formateFullDate(undefined, language, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              </View>
            </View>
            <View className="ml-4">
              <Switch
                trackColor={{ false: "#E5E7EB", true: "#10B981" }}
                thumbColor={isEnabled ? "#FFFFFF" : "#f4f3f4"}
                ios_backgroundColor="#10B981"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </View>
        </View>
        <View className="flex-row flex-wrap justify-between">
          <Pressable
            onPress={() =>
              router.navigate({
                pathname: "/weekly-orders",
                params: { mealTime: "breakfast" },
              })
            }
            className="w-full items-center bg-white border border-gray-200 px-6 py-8 mb-4 rounded-3xl relative"
          >
            <View className="absolute top-5 right-5">
              <ChevronRight color="#9CA3AF" size={22} />
            </View>
            <View className="items-center gap-y-4">
              <View className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                <SunMoon color="#FFA922" size={32} />
              </View>
              <Text className="text-gray-700 text-lg font-poppins_medium">
                {t("home.breakfast_orders")}
              </Text>
              <Text className="text-4xl font-poppins_bold text-gray-900">
                {data?.data.allOrders.breakfast ?? 0}
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() =>
              router.navigate({
                pathname: "/weekly-orders",
                params: { mealTime: "lunch" },
              })
            }
            className="w-[48%] items-center bg-white border border-gray-200 px-4 py-7 mb-4 rounded-3xl relative"
          >
            <View className="absolute top-4 right-4">
              <ChevronRight color="#9CA3AF" size={20} />
            </View>
            <View className="items-center gap-y-4">
              <View className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <Sun color="#F59E0B" size={30} />
              </View>
              <Text className="text-gray-700 text-lg font-poppins_medium">
                {t("home.lunch_orders")}
              </Text>
              <Text className="text-3xl font-poppins_bold text-gray-900">
                {data?.data.allOrders.lunch ?? 0}
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() =>
              router.navigate({
                pathname: "/weekly-orders",
                params: { mealTime: "dinner" },
              })
            }
            className="w-[48%] items-center bg-white border border-gray-200 px-4 py-7 mb-4 rounded-3xl relative"
          >
            <View className="absolute top-4 right-4">
              <ChevronRight color="#9CA3AF" size={20} />
            </View>
            <View className="items-center gap-y-4">
              <View className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                <Moon color="#6366F1" size={30} />
              </View>
              <Text className="text-gray-700 text-lg font-poppins_medium">
                {t("home.dinner_orders")}
              </Text>
              <Text className="text-3xl font-poppins_bold text-gray-900">
                {data?.data.allOrders.dinner ?? 0}
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
