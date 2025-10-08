import SafeScreen from "@/components/molecules/SafeScreen";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useEarnings } from "@/hooks/apis/useEarnings";
import { formatNum } from "@/lib/formate_num";
import { useAppStore } from "@/store/useAppStore";
import { router } from "expo-router";
import { ArrowLeft, Clock, MoveRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
});

export default function Earnings() {
  const { t } = useTranslation();
  const kitchenId = useAppStore((s) => s.user?.kitchen._id);

  const { data } = useEarnings(kitchenId);

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
          {t("earnings.earnings")}
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        className="flex-1"
      >
        <View className="gap-1.5 mt-1.5 flex-1">
          <View className="bg-white px-4 py-3 rounded-xl">
            <View className="flex-row items-center w-full justify-between">
              <Text className="font-poppins_regular uppercase text-sm">
                {t("earnings.todays_earning")}
              </Text>
              <Text className="text-brand-violet bg-brand-violet/10 rounded-md px-2 py-1 text-xs font-poppins_medium">
                {formatNum(data?.data.today.orders)} {t("earnings.orders")}
              </Text>
            </View>
            <Text className="font-poppins_semibold text-3xl mt-3">
              ₹ {formatNum(data?.data.today.earning)}
            </Text>
          </View>
          <View className="bg-white px-4 py-3 rounded-xl">
            <View className="flex-row items-center w-full justify-between">
              <Text className="font-poppins_regular uppercase text-sm">
                {t("earnings.last_week")}
              </Text>
              <Text className="text-brand-violet bg-brand-violet/10 rounded-md px-2 py-1 text-xs font-poppins_medium">
                {formatNum(data?.data.thisWeek.orders)} {t("earnings.orders")}
              </Text>
            </View>
            <Text className="font-poppins_semibold text-3xl mt-3">
              ₹ {formatNum(data?.data.thisWeek.earning)}
            </Text>
          </View>
          <View className="bg-white px-4 py-3 rounded-xl">
            <View className="flex-row items-center w-full justify-between">
              <Text className="font-poppins_regular uppercase text-sm">
                {t("earnings.last_month")}
              </Text>
              <Text className="text-brand-violet bg-brand-violet/10 rounded-md px-2 py-1 text-xs font-poppins_medium">
                {formatNum(data?.data.thisMonth.orders)} {t("earnings.orders")}
              </Text>
            </View>
            <Text className="font-poppins_semibold text-3xl mt-3">
              ₹ {formatNum(data?.data.thisMonth.earning)}
            </Text>
          </View>
          <View className="bg-white px-4 py-3 rounded-xl">
            <View className="flex-row items-center w-full justify-between">
              <Text className="font-poppins_regular uppercase text-sm">
                {t("earnings.all_time")}
              </Text>
              <Text className="text-brand-violet bg-brand-violet/10 rounded-md px-2 py-1 text-xs font-poppins_medium">
                {formatNum(data?.data.totalEarning.orders)}{" "}
                {t("earnings.orders")}
              </Text>
            </View>
            <Text className="font-poppins_semibold text-3xl mt-3">
              ₹ {formatNum(data?.data.totalEarning.earning)}
            </Text>
          </View>
        </View>
      </ScrollView>
      <Pressable
        onPress={() => router.navigate("/order-history")}
        className="flex-row mb-2 justify-between items-center bg-white px-5 py-5 rounded-xl"
      >
        <View className="flex-row mr-2">
          <Clock color="#676767" size={22} />
          <Text className="font-poppins_medium ml-3 text-brand-dark-gray">
            {t("earnings.view_order_history")}
          </Text>
        </View>
        <MoveRight color="#676767" size={22} />
      </Pressable>
    </SafeScreen>
  );
}
