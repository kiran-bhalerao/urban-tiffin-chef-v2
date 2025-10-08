import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react-native";
import { FC, useRef, useState } from "react";
import { Pressable, TextInput, TextInputProps, View } from "react-native";

interface EditableProps extends TextInputProps {
  value: string;
  setValue?: (value: string) => void;
  label: string;
  noEditable?: boolean;
}

export const Editable: FC<EditableProps> = ({
  value,
  setValue,
  label,
  noEditable = false,
  ...props
}) => {
  const inputRef = useRef<TextInput>(null);
  const [editable, setEditable] = useState(false);

  return (
    <View
      className={cn("gap-1.5 my-1.5", {
        "gap-1 my-1": noEditable,
      })}
    >
      <Text className="text-base font-poppins_semibold">{label}</Text>
      <View className="relative">
        <Input
          ref={inputRef}
          editable={editable && !noEditable}
          value={value}
          onChangeText={setValue}
          size="lg"
          className={cn({
            "pr-12 border-transparent": !editable,
            "bg-white": editable,
            "opacity-100": noEditable,
          })}
          {...props}
        />
        {!editable && !noEditable && (
          <Pressable
            onPress={() => {
              setEditable(true);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
            className="absolute right-0 px-4 top-0 bottom-0 flex items-center justify-center"
          >
            <Pencil color="#676767" size={18} />
          </Pressable>
        )}
      </View>
    </View>
  );
};
