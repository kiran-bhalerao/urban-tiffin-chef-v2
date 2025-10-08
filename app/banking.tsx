import { Editable } from "@/components/molecules/Editable";
import SafeScreen from "@/components/molecules/SafeScreen";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { BankDetailsData, useBankDetails } from "@/hooks/apis/useBankDetails";
import { useChangePaymentMode } from "@/hooks/apis/useChangePaymentMode";
import { IApiResponse } from "@/lib/axios";
import { useAppStore } from "@/store/useAppStore";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Switch, View } from "react-native";
import { toast } from "sonner-native";

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
});

export default function Banking() {
  const [isUPIEnabled, setIsUPIEnabled] = useState(false);
  const [isBankEnabled, setIsBankEnabled] = useState(true);

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const kitchenManagerId = useAppStore((s) => s.user?.kitchen.kitchenManager);
  const { data, isLoading } = useBankDetails(kitchenManagerId);

  useEffect(() => {
    if (data?.data.paymentMode === "upi") {
      setIsUPIEnabled(true);
      setIsBankEnabled(false);
    }
  }, [data?.data.paymentMode]);

  const { mutate, isPending } = useChangePaymentMode({
    onError(error) {
      toast.error(error);
    },
    onSuccess({ message, statusCode }, { paymentMode }) {
      toast.success(message);

      const queryKey = ["banking-data", kitchenManagerId];
      queryClient.setQueryData<IApiResponse<BankDetailsData>>(
        queryKey,
        (prevData) => {
          if (!prevData) return;
          return {
            ...prevData,
            data: {
              ...(prevData.data || {}),
              paymentMode,
            },
          };
        }
      );
    },
  });

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
          {t("banking.banking_details")}
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        className="flex-1 pt-4"
      >
        <Editable
          label={t("banking.bank_name")}
          value={data?.data.bankName.toUpperCase() || (isLoading ? "" : "NA")}
          noEditable
        />
        <Editable
          label={t("banking.bank_account_number")}
          value={
            data?.data.lf
              ? `**** **** **** ${data?.data.lf}`
              : isLoading
              ? ""
              : "NA"
          }
          noEditable
        />
        <Editable
          label={t("banking.bank_ifsc")}
          value={data?.data.ifsc.toUpperCase() || (isLoading ? "" : "NA")}
          noEditable
        />
        <Editable
          label={t("banking.upi_id")}
          value={data?.data.upi || (isLoading ? "" : "NA")}
          noEditable
        />
        <View className="gap-1.5 my-1.5">
          <Text className="text-base font-poppins_semibold">
            {t("banking.choose_payment_mode")}
          </Text>
          <View className="pl-4 mb-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-base">UPI</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#ffa92261" }}
                thumbColor={isUPIEnabled ? "#FFA922" : "#f4f3f4"}
                ios_backgroundColor="#ffa92261"
                onValueChange={() => {
                  setIsUPIEnabled((p) => !p);
                  setIsBankEnabled((p) => !p);
                }}
                value={isUPIEnabled}
              />
            </View>
          </View>
          <View className="pl-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-base">{t("banking.bank_account")}</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#ffa92261" }}
                thumbColor={isBankEnabled ? "#FFA922" : "#f4f3f4"}
                ios_backgroundColor="#ffa92261"
                onValueChange={() => {
                  setIsBankEnabled((p) => !p);
                  setIsUPIEnabled((p) => !p);
                }}
                value={isBankEnabled}
              />
            </View>
          </View>
        </View>
        <View className="mb-8" />
      </ScrollView>
      <Button
        isLoading={isPending}
        onPress={() => {
          if (kitchenManagerId) {
            mutate({
              kitchenManagerId,
              paymentMode: isUPIEnabled ? "upi" : "bank",
            });
          }
        }}
        className="bg-brand rounded-xl mt-auto mb-2"
        size="lg"
      >
        <Text className="font-poppins_semibold text-white text-base">
          {t("banking.save")}
        </Text>
      </Button>
    </SafeScreen>
  );
}
