import SafeScreen from "@/components/molecules/SafeScreen";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { ArrowLeft, ChevronRight, Mail, Phone } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
});

export default function ContactUs() {
  const phoneNumber = "9637668902";
  const email = "bk@urbantiffin.in";

  const { t } = useTranslation();

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
          {t("contact_us.contact_us")}
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        className="flex-1"
      >
        <View className="gap-1.5 mt-1 flex-1">
          <Pressable
            onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
            className="flex-row justify-between items-center bg-white px-5 py-4 rounded-xl"
          >
            <View className="flex-row items-center">
              <Phone color="#676767" size={20} />
              <Text className="text-brand-dark-gray ml-2 text-[15px]">
                {t("contact_us.phone")}
              </Text>
            </View>
            <ChevronRight color="#676767" size={20} />
          </Pressable>
          <Pressable
            onPress={() => Linking.openURL(`mailto:${email}`)}
            className="flex-row justify-between items-center bg-white px-5 py-4 rounded-xl"
          >
            <View className="flex-row items-center">
              <Mail color="#676767" size={20} />
              <Text className="text-brand-dark-gray ml-2 text-[15px]">
                {t("contact_us.email")}
              </Text>
            </View>
            <ChevronRight color="#676767" size={20} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
