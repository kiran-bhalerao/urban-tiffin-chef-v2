import Meal from "@/assets/images/meal.png";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Text } from "@/components/ui/text";
import { TransformedDeliveries } from "@/hooks/apis/useDeliveries";
import { useUpdateDeliveryStatus } from "@/hooks/apis/useUpdateDeliveryStatus";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Soup } from "lucide-react-native";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { toast } from "sonner-native";

const styles = StyleSheet.create({
  img: { width: 65, height: 65 },
  scrollView: {
    flexGrow: 1,
  },
});

const AssignItem: FC<{
  delivery: TransformedDeliveries["data"][number]["deliveries"][number]["deliveries"][number];
}> = ({ delivery }) => {
  return (
    <View className="bg-white px-4 py-2.5 mb-1 rounded-xl">
      <View className="flex-row justify-between items-center grow">
        <View className="flex-1">
          <Text className="text-brand-dark-gray flex-1 mb-0.5 text-base font-poppins_medium">
            {delivery.customerName}
          </Text>
          <View className="flex-row items-center flex-1">
            <Soup color="#676767" size={18} />
            <Text className="text-brand-dark-gray mx-2 flex-1 text-sm">
              {delivery.mealName}
            </Text>
          </View>
        </View>
        <Text className="text-center text-2xl font-poppins_bold ml-2">
          {delivery.mealQuantity}
        </Text>
      </View>
    </View>
  );
};

const AssignDelivery: FC<{
  id: number;
  kitchenId: string | undefined;
  mealTime: "breakfast" | "lunch" | "dinner";
  delivery: TransformedDeliveries["data"][number]["deliveries"][number];
}> = (props) => {
  const {
    id,
    mealTime,
    kitchenId,
    delivery: { deliveryId, deliverStatus, deliveries },
  } = props;

  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (deliverStatus === "delivered") {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [deliverStatus]);

  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useUpdateDeliveryStatus({
    onError(error) {
      toast.error(error);
    },
    onSuccess({ message }, { deliveryId, kitchenId, status }) {
      toast.success(message);

      const queryKey = ["deliveries-data", { mealTime }, kitchenId];
      const deliveryData =
        queryClient.getQueryData<TransformedDeliveries>(queryKey);

      const updatedDeliveryData: TransformedDeliveries = {
        data:
          deliveryData?.data.map((d) => {
            return {
              ...d,
              deliveries: d.deliveries.map((k) => {
                return {
                  ...k,
                  deliverStatus:
                    k.deliveryId === deliveryId ? status : k.deliverStatus,
                };
              }),
            };
          }) || [],
      };

      queryClient.setQueryData<TransformedDeliveries>(
        queryKey,
        updatedDeliveryData
      );
    },
  });

  return (
    <View className="mb-1.5 px-2 rounded-xl bg-slate-200/40 border border-slate-200">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger>
          <View className="flex-row relative my-2.5 mx-1 items-center justify-center">
            <View
              className={cn("absolute left-0", {
                "rotate-180": open,
              })}
            >
              <ChevronDown color="#676767" size={16} />
            </View>
            <Text className="text-sm uppercase font-poppins_medium text-center mr-2">
              {t("orders.delivery")} {id}
            </Text>
            <Text
              className={cn(
                "text-xs absolute right-0 font-poppins_medium px-2 py-1 uppercase rounded text-brand-violet bg-brand-violet/10 text-center ml-2",
                {
                  "text-green-600 bg-green-600/10":
                    deliverStatus === "delivered",
                }
              )}
            >
              {deliverStatus}
            </Text>
          </View>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {deliveries.map((delivery, i) => {
            return <AssignItem key={i} delivery={delivery} />;
          })}

          <Button
            disabled={deliverStatus === "delivered"}
            isLoading={isPending}
            onPress={() => {
              if (!!kitchenId) {
                mutate({ deliveryId, kitchenId, status: "delivered" });
              }
            }}
            size="sm"
            className="bg-brand rounded-xl mt-0.5 mb-2"
          >
            <Text className="font-poppins_semibold uppercase text-white text-sm">
              {t("orders.submit_delivery")}
            </Text>
          </Button>
        </CollapsibleContent>
      </Collapsible>
    </View>
  );
};

interface AssignTabProps {
  kitchenId: string | undefined;
  mealTime: "breakfast" | "lunch" | "dinner";
  mealDeliveriesFetched: boolean;
  deliveries: TransformedDeliveries["data"][number]["deliveries"];
}

export const AssignTab: FC<AssignTabProps> = (props) => {
  const { deliveries, mealTime, kitchenId, mealDeliveriesFetched } = props;
  const { t } = useTranslation();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollView}
      className="flex-1"
    >
      <View className="mt-1 flex-row justify-between mx-2">
        <Text className="text-[13px] uppercase">
          {t("orders.customer")} + {t("orders.dish")}
        </Text>
        <Text className="text-[13px] uppercase">{t("orders.orders")}</Text>
      </View>
      {deliveries.map((delivery, index) => {
        return (
          <AssignDelivery
            key={index}
            id={index + 1}
            kitchenId={kitchenId}
            mealTime={mealTime}
            delivery={delivery}
          />
        );
      })}
      {mealDeliveriesFetched && !deliveries.length && (
        <View className="flex-1 justify-center items-center">
          <Image style={styles.img} source={Meal} />
          <Text className="font-poppins_medium text-center mt-2 text-lg">
            {t("orders.no_deliveries")}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};
