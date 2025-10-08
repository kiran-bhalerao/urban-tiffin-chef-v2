import * as React from "react";
import { TextInput } from "react-native";

import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const inputVariants = cva(
  "h-12 rounded-md border font-poppins_regular border-input focus:border-brand bg-background px-3 text-brand-text text-base leading-6",
  {
    variants: {
      size: {
        default: "h-12 px-5",
        lg: "px-4 rounded-xl h-[56px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput> &
    VariantProps<typeof inputVariants>
>(({ className, size, ...props }, ref) => {
  return (
    <TextInput
      returnKeyType="done"
      ref={ref}
      className={cn(
        props.editable === false && "opacity-50",
        inputVariants({ size, className })
      )}
      placeholderTextColor="#2B2B2B"
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
