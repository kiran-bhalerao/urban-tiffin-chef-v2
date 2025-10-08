import SafeScreen from "@/components/molecules/SafeScreen";
import { AssignTab } from "@/components/organisms/weekly-orders/assign";
import { PrepareTab } from "@/components/organisms/weekly-orders/prepare";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useDeliveries } from "@/hooks/apis/useDeliveries";
import {
  transformKitchensWeeklyMeals,
  useKitchensWeeklyMeals,
} from "@/hooks/apis/useWeeklyMeals";
import { useEffectWhen } from "@/hooks/util/useEffectWhen";
import { isDatePassed } from "@/lib/date_passed";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View } from "react-native";

export default function WeeklyOrders() {
  const { mealTime } = useLocalSearchParams<{
    mealTime: "breakfast" | "lunch" | "dinner";
  }>();

  const [selectedDay, setSelectedDay] = useState<{
    date: Date;
    raw: string;
  }>();

  const {
    t,
    i18n: { language },
  } = useTranslation();
  const [tab, setTab] = useState<"prepare" | "assign">("prepare");

  const kitchenId = useAppStore((s) => s.user?.kitchen._id);
  const { data: mealDeliveriesData, isFetched: mealDeliveriesFetched } =
    useDeliveries(kitchenId, { mealTime });

  // Find the deliveries meals for the active day
  const mealDeliveries =
    mealDeliveriesData?.data.find(
      (w) => w.title === selectedDay?.date.toDateString()
    )?.deliveries || [];

  const { data: mealScheduleData, isFetched: mealScheduleDataFetched } =
    useKitchensWeeklyMeals(kitchenId, mealTime);

  const { dates, meals, mealItems } = useMemo(() => {
    return transformKitchensWeeklyMeals({
      language,
      activeDay: selectedDay?.raw,
      weeklyMeals: mealScheduleData?.data.weeklyOrders,
    });
  }, [language, mealScheduleData?.data.weeklyOrders, selectedDay?.raw]);

  const setInitialSelectedDay = useCallback(() => {
    const indexDate = dates.findIndex((d) => isDatePassed(d.date, true));

    if (indexDate !== undefined && indexDate !== -1) {
      setSelectedDay(dates[indexDate]);
    }
  }, [dates]);

  useEffectWhen(() => {
    setInitialSelectedDay();
  }, !!dates[0]);

  return (
    <SafeScreen>
      <View className="flex-row items-center mb-3.5">
        <Button
          className="!px-2 mb-0.5 !h-6"
          variant="ghost"
          onPress={() => router.back()}
        >
          <ArrowLeft color="#000000" />
        </Button>
        <Text className="text-2xl font-poppins_semibold text-gray-800 ml-2">
          {t(
            mealTime === "breakfast"
              ? "orders.breakfast"
              : mealTime === "dinner"
              ? "orders.dinner"
              : "orders.lunch"
          )}{" "}
          {t("orders.orders")}
        </Text>
      </View>
      {!!dates.length && (
        <View className="mb-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {dates?.map(({ date, raw, day, weekday }, i) => {
                return (
                  <Pressable
                    key={i}
                    onPress={() => setSelectedDay({ date, raw })}
                    className={cn(
                      "bg-white h-[60px] w-[72px] rounded-lg items-center px-0.5 py-2.5",
                      {
                        "bg-brand": raw === selectedDay?.raw,
                      }
                    )}
                  >
                    <Text
                      className={cn(
                        "text-[15px] text-brand-text font-poppins_semibold leading-5",
                        {
                          "text-white": raw === selectedDay?.raw,
                        }
                      )}
                    >
                      {weekday}
                    </Text>
                    <Text
                      className={cn(
                        "font-poppins_regular text-sm text-brand-text/60",
                        {
                          "text-white": raw === selectedDay?.raw,
                        }
                      )}
                    >
                      {day}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}
      <View className="bg-white mb-2 rounded-xl flex-row">
        <Pressable
          onPress={() => setTab("prepare")}
          className={cn("flex-1 py-2 border-2 border-white rounded-xl", {
            "bg-brand/30": tab === "prepare",
          })}
        >
          <Text className="text-center font-poppins_medium">
            {t("orders.prepare")}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab("assign")}
          className={cn("flex-1 border-2 border-white py-2 rounded-xl", {
            "bg-brand/30": tab === "assign",
          })}
        >
          <Text className="text-center font-poppins_medium">
            {t("orders.assign")}
          </Text>
        </Pressable>
      </View>
      {tab === "prepare" ? (
        <PrepareTab
          meals={meals}
          mealItems={mealItems}
          mealScheduleDataFetched={mealScheduleDataFetched}
        />
      ) : (
        <AssignTab
          kitchenId={kitchenId}
          mealTime={mealTime}
          deliveries={mealDeliveries}
          mealDeliveriesFetched={mealDeliveriesFetched}
        />
      )}
    </SafeScreen>
  );
}
