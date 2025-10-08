import WalletAsset from "@/assets/images/wallet.png";
import SafeScreen from "@/components/molecules/SafeScreen";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useWalletDetails } from "@/hooks/apis/useWalletDetails";
import {
  Transaction,
  useWalletTransactions,
} from "@/hooks/apis/useWalletTransactions";
import { useQueryRefresh } from "@/hooks/util/useQueryRefresh";
import { formateFullDate } from "@/lib/formate_full_date";
import { formatNum } from "@/lib/formate_num";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

const styles = StyleSheet.create({
  image: {
    height: 130,
    width: 130,
  },
});

export default function HomeWallet() {
  const { t } = useTranslation();
  const kitchenManagerId = useAppStore((s) => s.user?.kitchen.kitchenManager);

  const { data } = useWalletDetails(kitchenManagerId);
  const {
    data: tx,
    isFetching,
    fetchNextPage,
  } = useWalletTransactions(kitchenManagerId);

  const transactions = useMemo(
    () => tx?.pages.map((page) => page.data.transactions).flat() || [],
    [tx?.pages]
  );

  const {
    i18n: { language },
  } = useTranslation();

  const renderItem: ListRenderItem<Transaction> = useCallback(
    ({ item }) => (
      <View className="bg-white px-4 py-2 mb-1.5 rounded-xl">
        <View className="flex-row justify-between items-center ">
          <Text className="text-brand-dark-gray font-poppins_medium text-[15px]">
            {formateFullDate(item.createdAt, language, {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </Text>
          <Text
            className={cn("text-brand-red font-poppins_semibold text-[15px]", {
              "text-brand-green": item.transactionType === "wallet_credit",
            })}
          >
            {item.transactionType === "wallet_credit" ? "+" : "-"}
            {formatNum(item.amount)}
          </Text>
        </View>
        <Text className="text-brand-text/60 text-sm mt-2">
          {t("wallet.credit_source")}:{" "}
          <Text className="uppercase">
            {item.creditSource || item.withdrawSource}
          </Text>
        </Text>
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

  const { refreshing, onRefresh } = useQueryRefresh();

  return (
    <SafeScreen onlyTop>
      <View className="gap-1 pb-3">
        <Text className="text-2xl font-poppins_semibold text-gray-800">
          {t("wallet.wallet")}
        </Text>
      </View>
      <View className="flex-1">
        <View className="bg-white flex-row w-full justify-between rounded-xl px-4 py-5">
          <View className="mr-3">
            <Text className="text-sm uppercase font-poppins_medium text-gray-500">
              {t("wallet.balance")}
            </Text>
            <Text className="font-poppins_semibold text-4xl my-3">
              ₹ {formatNum(data?.data.wallet?.balance)}
            </Text>
            <Button
              onPress={() => {
                Linking.openURL("https://urbantiffin.in#support").catch(
                  () => {}
                );
              }}
              className="bg-brand rounded-xl"
              size="sm"
            >
              <Text className="font-poppins_medium text-white text-sm uppercase">
                {/* {t("wallet.withdraw")} */}
                Contact us
              </Text>
            </Button>
          </View>
          <Image style={styles.image} source={WalletAsset} />
        </View>
        <View className="bg-brand-violet/20 rounded-md w-full py-1.5 px-2 mt-2">
          <Text className="text-sm text-brand-violet">
            {/* {t("wallet.withdraw_info")} */}
            You can top-up your wallet with our delivery executive
          </Text>
        </View>
        <Text className="font-poppins_medium text-base mt-3.5 mb-1.5">
          {t("wallet.transaction_history")}
        </Text>
        <View className="flex-1">
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={transactions}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            onEndReached={() => fetchNextPage()}
            onEndReachedThreshold={0.001}
            ListFooterComponent={ListLoader}
          />
        </View>
      </View>
    </SafeScreen>
  );
}
