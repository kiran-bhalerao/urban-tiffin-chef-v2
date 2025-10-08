import SafeScreen from "@/components/molecules/SafeScreen";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  TransformedDeliveriesOrders,
  useOrderHistory,
} from "@/hooks/apis/useOrderHistory";
import { useQueryRefresh } from "@/hooks/util/useQueryRefresh";
import { formateFullDate } from "@/lib/formate_full_date";
import { formatNum } from "@/lib/formate_num";
import { useAppStore } from "@/store/useAppStore";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  gap: { gap: 6 },
});

interface MenuRowProps {
  date: string;
  orders: TransformedDeliveriesOrders["orders"];
}

const MenuRow: FC<MenuRowProps> = ({ date, orders }) => {
  const innerDeliveries = orders.flatMap((order) => order.deliveries);
  const {
    i18n: { language },
  } = useTranslation();

  const aggregatedAmount = innerDeliveries.reduce((acc, n) => acc + n.price, 0);

  return (
    <View className="">
      <View className="flex-row justify-between items-center">
        <Text
          className="font-poppins_semibold text-lg flex-1 my-2.5"
          numberOfLines={1}
        >
          {formateFullDate(date, language, {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <Text className="mr-3 text-brand-violet font-poppins_semibold">
          ₹{formatNum(aggregatedAmount)}
        </Text>
      </View>
      {innerDeliveries.map((order, i) => {
        return (
          <View
            key={order.mealId + i}
            className="flex-row items-start justify-start"
          >
            <View className="mr-1.5 mt-0.5 items-center">
              <View className="bg-brand rounded-full w-6 h-6 mb-2 justify-center items-center">
                <Text className="text-white text-sm font-poppins_semibold">
                  {i + 1}
                </Text>
              </View>
              <View className="w-[1px] bg-gray-200 grow mb-2" />
            </View>
            <View className="bg-white rounded-xl mb-2 px-3 py-2 grow">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="font-poppins_medium text-base">
                    {order.mealQuantity} x {order.mealName}
                  </Text>
                  <Text className="font-poppins_regular text-sm mt-0.5 text-brand-text/60">
                    {order.mealItems
                      .map((m) => `${m.name} (${m.units})`)
                      .join(" + ")}
                  </Text>
                </View>
                <View className="ml-1">
                  <View className="px-2 py-1">
                    <Text className="font-poppins_semibold text-center text-base text-brand-violet uppercase">
                      ₹{formatNum(order.price)}
                    </Text>
                  </View>
                  <View className="bg-brand/5 rounded-lg px-2 py-1 mt-1">
                    <Text className="font-poppins_semibold text-center text-xs text-brand uppercase">
                      {order.mealTime}
                    </Text>
                  </View>
                </View>
              </View>
              <Text
                className="font-poppins_medium text-[15px] mt-2"
                ellipsizeMode="tail"
                lineBreakMode="tail"
                numberOfLines={1}
              >
                Order by: {order.customerName}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default function OrderHistory() {
  const kitchenId = useAppStore((s) => s.user?.kitchen._id);
  const { data, isFetching, fetchNextPage } = useOrderHistory(kitchenId);
  const { t } = useTranslation();

  const orderHistory = useMemo(
    () => data?.pages.map((page) => page.orders).flat() || [],
    [data?.pages]
  );

  const aggregateByDeliveryDate = useMemo(
    () =>
      orderHistory.reduce((acc, order) => {
        const date = order.deliveryDate;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(order);
        return acc;
      }, {} as Record<string, typeof orderHistory>),
    [orderHistory]
  );

  const _data = Object.entries(aggregateByDeliveryDate).map(
    ([date, orders]) => ({ date, orders })
  );

  const noData = _data.length === 0;
  const ListLoader = useMemo(() => {
    if (isFetching) {
      return (
        <View className="py-6">
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return null;
  }, [isFetching]);

  const { refreshing, onRefresh } = useQueryRefresh();

  return (
    <SafeScreen>
      <View className="flex-row items-center mb-2">
        <Button
          className="!px-2 mb-0.5 !h-6"
          variant="ghost"
          onPress={() => router.back()}
        >
          <ArrowLeft color="#000000" />
        </Button>
        <Text className="text-2xl font-poppins_semibold text-gray-800 ml-2">
          {t("order_history.order_history")}
        </Text>
      </View>
      {noData ? (
        <View className="flex-1 justify-center items-center">{ListLoader}</View>
      ) : (
        <FlatList
          data={_data}
          renderItem={({ item }) => (
            <MenuRow date={item.date} orders={item.orders} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.gap}
          showsVerticalScrollIndicator={false}
          onEndReached={() => fetchNextPage()}
          onEndReachedThreshold={0.001}
          ListFooterComponent={kitchenId ? ListLoader : undefined}
        />
      )}
    </SafeScreen>
  );
}
