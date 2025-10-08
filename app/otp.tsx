import { Brand } from "@/components/molecules/Brand";
import SafeScreen from "@/components/molecules/SafeScreen";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useVerifyOtp } from "@/hooks/apis/useVerifyOtp";
import { useAppStore } from "@/store/useAppStore";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { OtpInput } from "react-native-otp-entry";
import { toast } from "sonner-native";

export default function OtpScreen() {
  const { t } = useTranslation();
  const { _id, mobile } = useLocalSearchParams<{
    _id: string;
    mobile: string;
  }>();

  const [otpInput, setOtpInput] = useState("");
  const { mutateAsync, isPending } = useVerifyOtp();
  const setUser = useAppStore((s) => s.setUser);
  const setAccessToken = useAppStore((s) => s.setAccessToken);

  const onSubmitPress = () => {
    if (otpInput.length < 4) {
      toast.error("Please enter OTP");

      return;
    }

    const otp = Number(otpInput);
    if (Number.isNaN(otp)) {
      toast.error("Please enter valid OTP");

      return;
    }

    mutateAsync({ otp, mobile: Number(mobile), _id })
      .then(({ message, data: { token, user, kitchen } }) => {
        toast.success(message);
        setUser({
          ...user,
          kitchen,
        });
        setAccessToken(token);
        router.dismissAll();
        router.replace("/(home)");
      })
      .catch(toast.error);
  };

  return (
    <SafeScreen>
      <KeyboardAwareScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <View className="justify-start grow">
          <Brand className="mt-8" />
        </View>
        <View className="gap-2 justify-center flex-[1.5] mb-4">
          <Text className="text-4xl leading-[50px] text-center text-slate-700 font-poppins_bold">
            {t("otp.otp_verification")}
          </Text>
          <Text className="text-center mb-8 text-brand-light-gray">
            {t("otp.otp_info", { mobile })}
          </Text>
          <View className="justify-center items-center">
            <OtpInput
              numberOfDigits={4}
              blurOnFilled
              onTextChange={setOtpInput}
              focusColor="#FFA922"
              theme={{
                pinCodeContainerStyle: { width: 60 },
                containerStyle: { gap: 18, width: "auto" },
              }}
            />
          </View>
        </View>
        <View className="flex mt-auto gap-3 pb-4">
          <Button
            className="mt-auto"
            variant="link"
            size="lg"
            onPress={() => router.back()}
          >
            <Text className="text-blue-500 underline text-sm font-poppins_regular">
              {t("otp.change_number")}?
            </Text>
          </Button>
          <Button
            className="bg-brand rounded-xl mb-2"
            size="lg"
            isLoading={isPending}
            onPress={onSubmitPress}
          >
            <Text className="font-poppins_semibold text-white text-base">
              {t("otp.submit")}
            </Text>
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </SafeScreen>
  );
}
