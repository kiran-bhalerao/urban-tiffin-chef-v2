import { useUpdateKitchenConfig } from "@/hooks/apis/useUpdateKitchenConfig";
import { I_LANGUAGE } from "@/i18n";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ChevronDown } from "lucide-react-native";
import React, { useCallback, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { toast } from "sonner-native";

const LANG: { id: I_LANGUAGE; label: string; value: string }[] = [
  { id: "en", label: "English", value: "english" },
  { id: "hi", label: "हिन्दी", value: "hindi" },
  { id: "mr", label: "मराठी", value: "marathi" },
];

export const ChangeLang = () => {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // renders
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.48}
      />
    ),
    []
  );

  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);
  const kitchenId = useAppStore((s) => s.user?.kitchen?._id);

  const { mutate } = useUpdateKitchenConfig({
    onError(error) {
      toast.error(error);
    },
    onSuccess({ message }) {
      toast.success(message);
    },
  });

  return (
    <>
      <Pressable
        onPress={handlePresentModalPress}
        className="flex-row gap-0.5 ml-auto items-center"
      >
        <Text className="text-sm text-gray-500">
          {LANG.find((l) => l.id === lang)?.label || "English"}
        </Text>
        <ChevronDown size={18} color="#676767" />
      </Pressable>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        enablePanDownToClose
        snapPoints={[1, 200]}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView>
          <View className="p-4">
            {LANG.map((l, i) => {
              return (
                <Pressable
                  key={i}
                  onPress={() => {
                    setLang(l.id);
                    if (kitchenId) {
                      mutate({ kitchenId, defaultLanguage: l.value });
                    }
                    bottomSheetModalRef.current?.close();
                  }}
                  className={cn(
                    "px-4 py-2.5 rounded-lg mb-1.5 border border-brand-violet/5 bg-brand-violet/5",
                    {
                      "border-brand-violet/70": lang === l.id,
                    }
                  )}
                >
                  <Text className="font-poppins_semibold">{l.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};
