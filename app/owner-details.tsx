import { Editable } from "@/components/molecules/Editable";
import SafeScreen from "@/components/molecules/SafeScreen";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAppStore } from "@/store/useAppStore";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  image: {
    width: 80,
    height: 80,
  },
});

export default function OwnerDetails() {
  const { t } = useTranslation();
  const name = useAppStore((s) => s.user?.name || "NA");
  const contact = useAppStore((s) => s.user?.mobile.toString() || "NA");
  const email = useAppStore((s) => s.user?.email || "NA");
  const fssai = useAppStore((s) => s.user?.fssai || "NA");

  // const [image, setImage] = useState("");
  // const pickImage = async () => {
  //   // No permissions request is necessary for launching the image library
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setImage(result.assets[0].uri);
  //   }
  // };

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
          {t("owner.owner_details")}
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        className="flex-1 pt-4"
      >
        {/* <View className="gap-1.5 my-1.5">
          <Text className="text-base font-poppins_semibold">
            Kitchen picture
          </Text>
          <View className="relative justify-start flex-row">
            <Pressable onPress={pickImage} className="flex-row items-center">
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={styles.image}
                  className="rounded-full"
                />
              ) : (
                <View className="p-4 bg-white rounded-full">
                  <ImageIcon color="#CFCFCF" size={38} />
                </View>
              )}
              <View className="ml-4 flex-row items-center">
                <Pencil color="#FFA922" size={18} />
                <Text className="text-sm font-poppins_medium text-brand ml-2">
                  {image ? "Update" : "Add"} Image
                </Text>
              </View>
            </Pressable>
          </View>
        </View> */}
        <Editable label={t("owner.full_name")} value={name} noEditable />
        <Editable
          label={t("owner.email")}
          value={email}
          noEditable
          keyboardType="email-address"
        />
        <Editable
          label={t("owner.contact_number")}
          value={contact}
          noEditable
        />
        <Editable label={t("owner.fssai_license")} value={fssai} noEditable />
        <View className="mb-8" />
      </ScrollView>
      {/* <Button className="bg-brand rounded-xl mt-auto" size="lg">
        <Text className="font-poppins_semibold text-white text-base">Save</Text>
      </Button> */}
    </SafeScreen>
  );
}
