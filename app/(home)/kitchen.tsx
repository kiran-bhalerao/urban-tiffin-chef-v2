import { ChangeLang } from "@/components/molecules/ChangeLang";
import SafeScreen from "@/components/molecules/SafeScreen";
import { Text } from "@/components/ui/text";
import { useAppStore } from "@/store/useAppStore";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
// import messaging from "@react-native-firebase/messaging";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  ChevronRight,
  Clock,
  CookingPot,
  IndianRupee,
  Landmark,
  Settings,
  Soup,
  User,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
});

export default function HomeKitchen() {
  const { t } = useTranslation();

  const name = useAppStore((s) => s.user?.kitchen?.name);
  const mobile = useAppStore((s) => s.user?.mobile);
  const rating = useAppStore((s) => s.user?.kitchen.rating || "NA");
  const queryClient = useQueryClient();
  const logout = useAppStore((s) => s.logout);

  // const [fcmToken, setFcmToken] = useState("");
  // useEffect(() => {
  //   try {
  //     void messaging()
  //       .getToken()
  //       .then((token) => setFcmToken(token));
  //   } catch {
  //     // Ignore
  //   }
  // }, []);

  const onLogout = () => {
    Alert.alert(t("kitchen.logout"), t("kitchen.logout_alert"), [
      {
        text: t("kitchen.cancel"),
        style: "cancel",
      },
      {
        text: t("kitchen.yes"),
        onPress: () => {
          queryClient.clear();
          logout();
          router.dismissAll();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <BottomSheetModalProvider>
      <SafeScreen onlyTop>
        <View className="gap-1 pb-3.5 border-b border-gray-300">
          <Text
            className="text-2xl capitalize font-poppins_semibold text-gray-800"
            lineBreakMode="tail"
            numberOfLines={2}
          >
            {name || "Your Kitchen"}
          </Text>
          <View className="flex-row items-center">
            <View className="flex-row items-center">
              <FontAwesome name="star" size={16} color="orange" />
              <Text className="text-sm text-gray-500 ml-1">{rating}</Text>
            </View>
            <Text className="text-sm text-gray-500 mx-2">|</Text>
            <Text className="text-sm text-gray-500">+91 {mobile}</Text>
            <ChangeLang />
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
          className="flex-1"
        >
          <View className="gap-1.5 my-3 flex-1">
            <Pressable
              onPress={() => router.navigate("/owner-details")}
              className="flex-row justify-between items-center bg-white px-5 py-4 rounded-xl"
            >
              <View className="flex-row items-center">
                <User color="#676767" size={20} />
                <Text className="text-brand-dark-gray ml-2 text-[15px]">
                  {t("kitchen.owner_details")}
                </Text>
              </View>
              <ChevronRight color="#676767" size={20} />
            </Pressable>
            <Pressable
              onPress={() => router.navigate("/banking")}
              className="flex-row justify-between items-center bg-white px-5 py-4 rounded-xl"
            >
              <View className="flex-row items-center">
                <Landmark color="#676767" size={20} />
                <Text className="text-brand-dark-gray ml-2 text-[15px]">
                  {t("kitchen.banking_details")}
                </Text>
              </View>
              <ChevronRight color="#676767" size={20} />
            </Pressable>
            <Pressable
              onPress={() => router.navigate("/order-history")}
              className="flex-row justify-between items-center bg-white px-5 py-4 rounded-xl"
            >
              <View className="flex-row items-center">
                <Clock color="#676767" size={20} />
                <Text className="text-brand-dark-gray ml-2 text-[15px]">
                  {t("kitchen.order_history")}
                </Text>
              </View>
              <ChevronRight color="#676767" size={20} />
            </Pressable>
            <Pressable
              onPress={() => router.navigate("/meals")}
              className="flex-row justify-between items-center bg-white px-5 py-4 rounded-xl"
            >
              <View className="flex-row items-center">
                <CookingPot color="#676767" size={20} />
                <Text className="text-brand-dark-gray ml-2 text-[15px]">
                  {t("kitchen.kitchen_meals")}
                </Text>
              </View>
              <ChevronRight color="#676767" size={20} />
            </Pressable>
            <Pressable
              onPress={() => router.navigate("/scheduled-menu")}
              className="flex-row justify-between items-center bg-white px-5 py-4 rounded-xl"
            >
              <View className="flex-row items-center">
                <Soup color="#676767" size={20} />
                <Text className="text-brand-dark-gray ml-2 text-[15px]">
                  {t("kitchen.scheduled_menu")}
                </Text>
              </View>
              <ChevronRight color="#676767" size={20} />
            </Pressable>
            <Pressable
              onPress={() => router.navigate("/earnings")}
              className="flex-row justify-between items-center bg-white px-5 py-4 rounded-xl"
            >
              <View className="flex-row items-center">
                <IndianRupee color="#676767" size={20} />
                <Text className="text-brand-dark-gray ml-2 text-[15px]">
                  {t("kitchen.earings")}
                </Text>
              </View>
              <ChevronRight color="#676767" size={20} />
            </Pressable>

            <Pressable
              onPress={() => router.navigate("/advance-settings")}
              className="flex-row justify-between items-center bg-white px-5 py-4 rounded-xl"
            >
              <View className="flex-row items-center">
                <Settings color="#676767" size={20} />
                <Text className="text-brand-dark-gray ml-2 text-[15px]">
                  {t("kitchen.advance_settings")}
                </Text>
              </View>
              <ChevronRight color="#676767" size={20} />
            </Pressable>
          </View>
          <Pressable
            className="mb-2"
            // onPress={() => Clipboard.setStringAsync(fcmToken)}
          >
            <Text className="text-center text-[15px] text-brand-text/75 mt-2">
              Urban Tiffin Kitchen v0.0.1
            </Text>
          </Pressable>
        </ScrollView>
      </SafeScreen>
    </BottomSheetModalProvider>
  );
}
