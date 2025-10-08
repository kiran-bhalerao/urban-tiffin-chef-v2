import { Brand } from "@/components/molecules/Brand";
import SafeScreen from "@/components/molecules/SafeScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useGenOtp } from "@/hooks/apis/useGetOtp";
import { validatePhoneNumber } from "@/lib/phone_num_valid";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { toast } from "sonner-native";

function LoginScreen() {
  const { t } = useTranslation();
  const [mobile, setMobile] = useState(""); // 9637668902
  const { mutateAsync, isPending } = useGenOtp();

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
        <View className="justify-start flex-1">
          <Brand className="mt-8" />
        </View>
        <View className="gap-4 justify-center flex-[1.5]">
          <Text className="text-4xl text-center leading-[50px] text-slate-700 font-poppins_bold">
            {t("login.kitchen_verification")}
          </Text>
          <Text className="text-center mb-8 text-brand-light-gray">
            {t("login.verification_info")}
          </Text>
          <Input
            keyboardType="phone-pad"
            placeholder={t("login.phone_placeholder")}
            value={mobile}
            onChangeText={setMobile}
            size="lg"
            className="font-poppins text-brand-text"
          />
        </View>
        <View className="pb-4">
          <Button
            className="bg-brand rounded-xl mt-4 mb-2"
            size="lg"
            isLoading={isPending}
            onPress={() => {
              const error = validatePhoneNumber(mobile.trim());
              if (error) {
                toast.error(error);
                return;
              }

              mutateAsync({ mobile })
                .then(({ data: { _id, mobile }, message }) => {
                  toast.success(message);
                  router.navigate({
                    pathname: "/otp",
                    params: { _id, mobile },
                  });
                })
                .catch(toast.error);
            }}
          >
            <Text className="font-poppins_semibold uppercase text-white text-base">
              {t("login.submit")}
            </Text>
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </SafeScreen>
  );
}

export default LoginScreen;
