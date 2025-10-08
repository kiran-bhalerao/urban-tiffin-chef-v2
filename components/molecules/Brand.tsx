import { Image, ImageStyle, StyleProp, View } from "react-native";

import Logo from "@/assets/images/logo.png";
import { cn } from "@/lib/utils";

type Props = {
  style?: StyleProp<ImageStyle>;
  className?: string;
};

export function Brand({ style, className }: Props) {
  return (
    <View className={cn("items-center", className)}>
      <Image style={[{ height: 220, width: 220 }, style]} source={Logo} />
    </View>
  );
}
