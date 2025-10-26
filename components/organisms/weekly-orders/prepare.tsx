import Meal from "@/assets/images/meal.png";
import { Text } from "@/components/ui/text";
import { TransformedKitchensWeeklyMeals } from "@/hooks/apis/useWeeklyMeals";
import { useQueryRefresh } from "@/hooks/util/useQueryRefresh";
import { cn } from "@/lib/utils";
import { ChevronRight, Soup } from "lucide-react-native";
import { FC, useState } from "react";
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
  meal: TransformedKitchensWeeklyMeals["meals"][number];
}> = ({ meal }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      onPress={() => {
        if (!!meal.mealItems?.length) {
          setExpanded((p) => !p);
        }
      }}
      className={cn(
        "border border-white bg-white px-4 py-4 mb-1.5 rounded-xl",
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
            {meal.name}
          </Text>
          {!!meal.mealItems?.length && (
            <ChevronRight color="#676767" size={22} />
          )}
        </View>
        <View className="bg-blue-50 px-2 py-1 rounded-lg min-w-[40px]">
          <Text className="text-center text-xl font-poppins_bold text-blue-700">
            {meal.quantity || "NA"}
          </Text>
        </View>
      </View>
      {expanded && (
        <View className="mx-1 mt-2">
          {meal.mealItems?.map((item, i) => {
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

interface PrepareTabProps {
  mealScheduleDataFetched: boolean;
  meals: TransformedKitchensWeeklyMeals["meals"];
  mealItems: TransformedKitchensWeeklyMeals["mealItems"];
}

export const PrepareTab: FC<PrepareTabProps> = (props) => {
  const { meals, mealItems, mealScheduleDataFetched } = props;
  const { t } = useTranslation();

  const allMealItems = meals?.reduce<
    Record<string, PrepareTabProps["mealItems"][number]>
  >((acc, meal) => {
    [...(mealItems || [])].forEach((item) => {
      // Check if the item already exists in the accumulator (based on item name)
      if (acc[item.name]) {
        // Add the units to the existing item (ensure both are numbers)
        acc[item.name].units = String(
          Number(acc[item.name].units) + Number(item.units || 0)
        );
      } else {
        // Add the new item to the accumulator with units as a number
        acc[item.name] = { ...item, units: String(item.units) };
      }
    });
    return acc;
  }, {});

  // Convert the result back into an array of meal items
  const combinedMealItems = Object.values(allMealItems);

  // Group meals by customer name
  const groupedMeals = meals.reduce<
    Record<string, TransformedKitchensWeeklyMeals["meals"]>
  >((acc, meal) => {
    const customerName = meal.customerName || "Unknown";
    if (!acc[customerName]) {
      acc[customerName] = [];
    }
    acc[customerName].push(meal);
    return acc;
  }, {});

  const { refreshing, onRefresh } = useQueryRefresh();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollView}
      className="flex-1 relative"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="my-1 flex-row justify-between mx-2">
        <Text className="text-[13px] uppercase">{t("orders.orders")}</Text>
        <Text className="text-[13px] uppercase">count</Text>
      </View>
      <View className={cn({ "flex-1": !meals.length })}>
        {Object.entries(groupedMeals).map(([customerName, customerMeals]) => {
          const customerAddress = customerMeals[0]?.customerAddress;
          return (
            <View key={customerName} className="mb-2">
              <View className="bg-gray-100 px-2 py-2 rounded-lg mx-0.5">
                <Text className="text-lg font-poppins_semibold text-gray-800">
                  {customerName}
                </Text>
                {customerAddress && (
                  <Text className="text-base text-gray-600 mt-0.5">
                    {customerAddress}
                  </Text>
                )}
              </View>
              {customerMeals.map((meal, i) => (
                <DishItem key={i} meal={meal} />
              ))}
            </View>
          );
        })}
        {!meals.length && (
          <>
            {mealScheduleDataFetched ? (
              <View className="flex-1 my-6 justify-center items-center">
                <Image style={styles.img} source={Meal} />
                <Text className="font-poppins_medium mt-2 text-lg">
                  {t("orders.no_meals")}
                </Text>
              </View>
            ) : (
              <View className="flex-1 justify-center items-center my-6">
                <ActivityIndicator size="large" />
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};
