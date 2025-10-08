import SafeScreen from "@/components/molecules/SafeScreen";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TAlerts, useAlerts } from "@/hooks/apis/useAlerts";
import { formateFullDate } from "@/lib/formate_full_date";
import { useAppStore } from "@/store/useAppStore";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
} from "react-native";

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  gap: { gap: 4 },
});

export default function Alerts() {
  const kitchenManagerId = useAppStore((s) => s.user?.kitchen.kitchenManager);
  const { data, fetchNextPage, isFetching } = useAlerts(kitchenManagerId);
  const alerts = useMemo(
    () => data?.pages.map((page) => page.data.alerts).flat() || [],
    [data?.pages]
  );

  const {
    i18n: { language },
  } = useTranslation();

  const renderItem: ListRenderItem<TAlerts> = useCallback(
    ({ item }) => (
      <View className="bg-white border border-slate-200/70 px-4 py-5 rounded-xl">
        <Text className="font-poppins_semibold mb-2">
          {formateFullDate(item.date, language)}
        </Text>
        <Text className="font-poppins_regular">{item.description}</Text>
      </View>
    ),
    []
  );

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
          Alerts
        </Text>
      </View>
      <FlatList
        data={alerts}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.gap}
        showsVerticalScrollIndicator={false}
        onEndReached={() => fetchNextPage()}
        onEndReachedThreshold={0.001}
        ListFooterComponent={ListLoader}
        // ListFooterComponent={userId ? ListLoader : undefined}
      />
    </SafeScreen>
  );
}
