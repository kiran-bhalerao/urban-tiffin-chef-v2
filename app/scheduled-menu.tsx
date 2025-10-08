import Meal from "@/assets/images/meal.png";
import SafeScreen from "@/components/molecules/SafeScreen";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  TransformedKitchenMealSchedules,
  transformMealSchedules,
  useKitchenMealSchedules,
} from "@/hooks/apis/useKitchenMealSchedules";
import { useEffectWhen } from "@/hooks/util/useEffectWhen";
import { useQueryRefresh } from "@/hooks/util/useQueryRefresh";
import { isDatePassed } from "@/lib/date_passed";
import { formatNum } from "@/lib/formate_num";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { router } from "expo-router";
import { ArrowLeft, ChevronRight, Soup } from "lucide-react-native";
import { FC, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const styles = StyleSheet.create({
  img: { width: 65, height: 65 },
  scrollView: {
    flexGrow: 1,
  },
});

const DishItem: FC<{
  meal: TransformedKitchenMealSchedules["meals"][number];
}> = ({ meal }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      onPress={() => setExpanded((p) => !p)}
      className={cn(
        "border border-white bg-white px-4 py-4 mb-1.5 rounded-xl relative",
        {
          "border-brand": expanded,
        }
      )}
    >
      <View className="flex-row grow justify-between items-center">
        <View className="flex-row flex-1 items-center">
          <View
            className={cn("p-0.5 border border-red-600 mr-2 mt-1", {
              "border-green-600": meal.mealPreference?.toLowerCase() === "veg",
            })}
          >
            <View
              className={cn("h-1.5 w-1.5 bg-red-600 rounded-full", {
                "bg-green-600": meal.mealPreference?.toLowerCase() === "veg",
              })}
            />
          </View>
          <Soup color="#676767" size={22} />
          <Text className="text-brand-dark-gray flex-1 mx-2 text-base">
            {meal.title}
          </Text>
          <ChevronRight color="#676767" size={22} />
        </View>
        <Text className="text-center text-xl font-poppins_bold">
          ₹{formatNum(meal.price)}
        </Text>
      </View>
      {expanded && (
        <View className="mx-1 mt-2">
          {meal.mealItems.map((item, i) => {
            return (
              <Text key={i} className="text-sm text-brand-text/60">
                {i + 1}. {item.name} ({item.units})
              </Text>
            );
          })}
        </View>
      )}
    </Pressable>
  );
};

export default function ScheduledMenu() {
  const [selectedDay, setSelectedDay] = useState<{
    date: Date;
    raw: string;
  }>();
  const [mealTime, setMealTime] = useState<"breakfast" | "lunch" | "dinner">(
    "breakfast"
  );
  const kitchenId = useAppStore((s) => s.user?.kitchen._id) ?? "";

  const {
    t,
    i18n: { language },
  } = useTranslation();

  const { data: mealScheduleData, isFetched } =
    useKitchenMealSchedules(kitchenId);

  const { dates, meals } = useMemo(() => {
    return transformMealSchedules({
      language,
      mealTime,
      activeDay: selectedDay?.raw,
      scheduleMeals: mealScheduleData?.data.scheduleMeals,
    });
  }, [
    language,
    mealTime,
    mealScheduleData?.data.scheduleMeals,
    selectedDay?.raw,
  ]);

  const setInitialSelectedDay = useCallback(() => {
    const indexDate = dates.findIndex((d) => isDatePassed(d.date, true));

    if (indexDate !== undefined && indexDate !== -1) {
      setSelectedDay(dates[indexDate]);
    }
  }, [dates]);

  useEffectWhen(() => {
    setInitialSelectedDay();
  }, !!dates[0]);

  const { refreshing, onRefresh } = useQueryRefresh();

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
          {t("scheduled_meals.scheduled_menu")}
        </Text>
      </View>
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
      <View className="bg-white mb-2 rounded-xl flex-row">
        <Pressable
          onPress={() => setMealTime("breakfast")}
          className={cn("flex-1 py-2 border-2 border-white rounded-xl", {
            "bg-brand/30": mealTime === "breakfast",
          })}
        >
          <Text className="text-center font-poppins_medium">
            {t("scheduled_meals.breakfast")}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setMealTime("lunch")}
          className={cn("flex-1 border-2 border-white py-2 rounded-xl", {
            "bg-brand/30": mealTime === "lunch",
          })}
        >
          <Text className="text-center font-poppins_medium">
            {t("scheduled_meals.lunch")}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setMealTime("dinner")}
          className={cn("flex-1 border-2 border-white py-2 rounded-xl", {
            "bg-brand/30": mealTime === "dinner",
          })}
        >
          <Text className="text-center font-poppins_medium">
            {t("scheduled_meals.dinner")}
          </Text>
        </Pressable>
      </View>
      {!meals.length && (
        <>
          {isFetched ? (
            <View className="flex-1 my-6 justify-center items-center">
              <Image style={styles.img} source={Meal} />
              <Text className="font-poppins_medium mt-2 text-lg">
                {mealTime === "breakfast"
                  ? t("scheduled_meals.no_breakfast_found")
                  : mealTime === "dinner"
                  ? t("scheduled_meals.no_dinner_found")
                  : t("scheduled_meals.no_lunch_found")}
              </Text>
            </View>
          ) : (
            <View className="flex-1 justify-center items-center my-6">
              <ActivityIndicator size="large" />
            </View>
          )}
        </>
      )}
      {!!meals.length && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className="my-1 flex-row justify-between mx-2">
            <Text className="text-[13px] uppercase">
              {t("scheduled_meals.dish")}
            </Text>
            <Text className="text-[13px] uppercase">
              {t("scheduled_meals.price")}
            </Text>
          </View>
          <View>
            {meals.map((meal, i) => {
              return <DishItem key={i} meal={meal} />;
            })}
          </View>
        </ScrollView>
      )}
    </SafeScreen>
  );
}
