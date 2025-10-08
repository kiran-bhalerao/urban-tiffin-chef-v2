import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { ActivityIndicator, Pressable, View } from "react-native";

import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary active:opacity-90",
        destructive: "bg-destructive active:opacity-90",
        outline: "border border-input bg-background active:bg-accent",
        secondary: "bg-secondary active:opacity-80",
        ghost: "active:bg-accent",
        link: "",
      },
      size: {
        default: "h-14 px-5 py-3",
        sm: "h-12 rounded-md px-3",
        lg: "rounded-md px-8 h-[54px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const buttonTextVariants = cva("text-base font-medium text-foreground", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      destructive: "text-destructive-foreground",
      outline: "group-active:text-accent-foreground",
      secondary:
        "text-secondary-foreground group-active:text-secondary-foreground",
      ghost: "group-active:text-accent-foreground",
      link: "text-primary group-active:underline",
    },
    size: {
      default: "",
      sm: "",
      lg: "text-lg",
      icon: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants> & { isLoading?: boolean };

const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(
  (
    {
      className,
      variant,
      size,
      children,
      isLoading,
      disabled = isLoading,
      ...props
    },
    ref
  ) => {
    return (
      <TextClassContext.Provider
        value={cn(buttonTextVariants({ variant, size }))}
      >
        <Pressable
          className={cn(
            disabled && "opacity-70",
            buttonVariants({ variant, size, className })
          )}
          ref={ref}
          disabled={disabled}
          role="button"
          {...props}
        >
          <View className="gap-2 h-full mt-0.5 flex-row items-center">
            <>{children}</>
            {isLoading && <ActivityIndicator size="small" color="#fff" />}
          </View>
        </Pressable>
      </TextClassContext.Provider>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
