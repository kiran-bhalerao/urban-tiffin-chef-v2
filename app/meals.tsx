import SafeScreen from "@/components/molecules/SafeScreen";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  KitchenMealsData,
  useKitchenMeals,
} from "@/hooks/apis/useKitchenMeals";
import { useUpdateMealStatus } from "@/hooks/apis/useUpdateMealStatus";
import { useQueryRefresh } from "@/hooks/util/useQueryRefresh";
import { IApiResponse } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { ArrowLeft, ChevronRight, Soup } from "lucide-react-native";
import { FC, useMemo, useState } from "react";
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

interface MealItemProps {
  _id: string;
  name: string;
  description: string;
  price: number;
  active?: boolean;
  mealItems: {
    name: string;
    units: string;
    unitLabel: string;
    order: number;
  }[];
}

const MealItem: FC<MealItemProps> = (props) => {
  const { _id, name, mealItems, description, active = true, price } = props;
  const [expanded, setExpanded] = useState(false);
  const [isEnabled, setIsEnabled] = useState(active);

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const kitchenId = useAppStore((s) => s.user?.kitchen._id);

  const { mutate } = useUpdateMealStatus({
    onError(error, { active }) {
      toast.error(error);
      setIsEnabled(!active);
    },
    onSuccess({ message }, { mealId, active }) {
      toast.success(message);

      const queryKey = ["kitchen-meals", kitchenId];
      queryClient.setQueryData<IApiResponse<KitchenMealsData[]>>(
        queryKey,
        (prevData) => {
          if (!prevData) return;
          return {
            ...prevData,
            data: prevData.data.map((d) => {
              return {
                ...d,
                active: mealId === d._id ? active : d.active,
              };
            }),
          };
        }
      );
    },
  });

  const onToggle = () => {
    if (!isEnabled) {
      const newState = true;
      if (kitchenId) {
        mutate({ kitchenId, mealId: _id, active: true });
      }
      setIsEnabled(newState);
      return;
    }

    Alert.alert(
      t("meals.disable_meal"),
      t("meals.disable_meal_info", { mealName: name }),
      [
        {
          text: t("meals.cancel"),
          style: "cancel",
        },
        {
          text: t("meals.yes"),
          onPress: () => {
            const newState = false;
            if (kitchenId) {
              mutate({ kitchenId, mealId: _id, active: false });
            }
            setIsEnabled(newState);
          },
        },
      ]
    );
  };

  return (
    <View className="flex-row items-start">
      <View className="mt-2 mr-2">
        <Switch
          trackColor={{ false: "#767577", true: "#ffa92261" }}
          thumbColor={isEnabled ? "#FFA922" : "#f4f3f4"}
          ios_backgroundColor="#ffa92261"
          onValueChange={() => {
            onToggle();
          }}
          value={isEnabled}
        />
      </View>
      <Pressable
        onPress={() => setExpanded((p) => !p)}
        className={cn(
          "border flex-1 border-white bg-white px-4 py-4 mb-1 rounded-xl",
          {
            "border-brand": expanded,
          }
        )}
      >
        <View className="flex-row flex-1 justify-between items-center">
          <View className="flex-row flex-1 items-center">
            <Soup color="#676767" size={22} />
            <Text className="text-brand-dark-gray mx-2 flex-1 text-base">
              {name}
            </Text>
            <ChevronRight color="#676767" size={22} />
          </View>
          <Text className="text-center text-xl font-poppins_bold ml-2">
            ₹{price}
          </Text>
        </View>
        {expanded && (
          <View className="mx-1 mt-2">
            {mealItems.map(({ name, units }, i) => {
              return (
                <Text key={i} className="text-sm text-brand-text/60">
                  {i + 1}. {name} ({units})
                </Text>
              );
            })}
            <Text className="text-sm text-brand-text mt-1.5">
              {description}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default function Meals() {
  const [tab, setTab] = useState<"breakfast" | "lunch" | "dinner">("breakfast");

  const { t } = useTranslation();
  const kitchenId = useAppStore((s) => s.user?.kitchen._id);
  const { data } = useKitchenMeals(kitchenId);

  const meals = useMemo(() => {
    return data?.data.filter((d) => {
      return d.mealTime.toLowerCase() === tab;
    });
  }, [tab, data?.data]);

  const { refreshing, onRefresh } = useQueryRefresh();

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
          {t("meals.kitchen_meals")}
        </Text>
      </View>
      <View className="bg-white my-2 rounded-xl flex-row">
        <Pressable
          onPress={() => setTab("breakfast")}
          className={cn("flex-1 py-2 border-2 border-white rounded-xl", {
            "bg-brand/30": tab === "breakfast",
          })}
        >
          <Text className="text-center font-poppins_medium">
            {t("meals.breakfast")}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab("lunch")}
          className={cn("flex-1 border-2 border-white py-2 rounded-xl", {
            "bg-brand/30": tab === "lunch",
          })}
        >
          <Text className="text-center font-poppins_medium">
            {t("meals.lunch")}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab("dinner")}
          className={cn("flex-1 border-2 border-white py-2 rounded-xl", {
            "bg-brand/30": tab === "dinner",
          })}
        >
          <Text className="text-center font-poppins_medium">
            {t("meals.dinner")}
          </Text>
        </Pressable>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="my-1 flex-row mx-2">
          <Text className="text-[13px] uppercase">{t("meals.active")}</Text>
          <Text className="text-[13px] uppercase ml-4">{t("meals.meal")}</Text>
          <Text className="text-[13px] uppercase ml-auto">
            {t("meals.price")}
          </Text>
        </View>
        <View>
          {meals?.map(
            ({ _id, price, mealItems, active, name, description }) => {
              return (
                <MealItem
                  key={_id}
                  _id={_id}
                  active={active}
                  price={price}
                  description={description}
                  name={name}
                  mealItems={mealItems}
                />
              );
            }
          )}
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
