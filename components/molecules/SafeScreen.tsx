import { cn } from "@/lib/utils";
import { StatusBar } from "expo-status-bar";
import { type PropsWithChildren } from "react";
import { Platform, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

function SafeScreen({
  children,
  className = "",
  onlyTop,
}: PropsWithChildren & { className?: string; onlyTop?: boolean }) {
  const insets = useSafeAreaInsets();

  const Comp = (
    <>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <View className={cn("px-3 pt-3 flex-1", className)}>{children}</View>
    </>
  );

  if (onlyTop) {
    return (
      <View
        style={{ paddingTop: insets.top }}
        className="flex-1 bg-brand-background relative"
      >
        {Comp}
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-background relative">
      {Comp}
    </SafeAreaView>
  );
}

export default SafeScreen;
