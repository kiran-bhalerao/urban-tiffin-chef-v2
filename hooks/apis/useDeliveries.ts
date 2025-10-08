import { QueryOptions, useQuery } from "@tanstack/react-query";

import { axios, IApiError, IApiResponse } from "@/lib/axios";

interface DeliveriesData {
  allDeliveries: {
    title: string;
    deliveries: {
      _id: string;
      deliveryId: string;
      deliveries: {
        order: {
          _id: string;
          orderBy: string;
          kitchen: string;
          items: {
            meal: {
              _id: string;
              name: string;
              description: string;
              tags: string[];
              mealItems: {
                name: string;
                units: string;
                unitLabel: string;
                order: number;
              }[];
              images: string[];
              kitchen: string;
              kitchenManager: string;
              mealTime: string;
              price: number;
              mealPreference: string;
              cuisine: string;
              mealCategories: string[];
              quantity: number;
              rating: number;
              createdAt: string;
              updatedAt: string;
              active: boolean;
            };
            quantity: number;
            status: string;
            mealTime: string;
            deliveryStartDateTime: string;
            deliveryEndDateTime: string;
            deliverySlot: string;
          }[];
          deliveryDate: string;
          deliveryAddress: string;
          createdAt: string;
          updatedAt: string;
        };
        customer: {
          _id: string;
          mobile: number;
          address: string[];
          createdAt: string;
          deliveryHub: any[];
          emailVerified: boolean;
          mobileVerified: boolean;
          updatedAt: string;
          name: string;
        };
      }[];
      mealTime: string;
      deliveryServiceProvider: string;
      deliverStatus: "processing" | "delivered" | "undelivered";
      deliveryDate: string;
      trackingUrl: string;
    }[];
  }[];
}

export interface TransformedDeliveries {
  data: {
    title: string;
    deliveries: {
      deliveryId: string;
      deliverStatus: "processing" | "delivered" | "undelivered";
      deliveries: {
        mealName: string;
        mealQuantity: number;
        status: string;
        customerId: string;
        customerName: string;
      }[];
    }[];
  }[];
}

interface DeliveriesParams {
  mealTime: "lunch" | "dinner" | "breakfast";
}

export async function fetchDeliveriesData(
  kitchenId: string,
  params: DeliveriesParams
) {
  const endpoint = `/kitchens/${kitchenId}/kitchenDeliveries`;
  const apiResponse = await axios.get<IApiResponse<DeliveriesData>>(endpoint, {
    params,
  });

  const transformedResponse = apiResponse.data.data?.allDeliveries?.map(
    (delivery) => {
      const transformedDeliveries = delivery.deliveries.map((outerDelivery) => {
        const orders = outerDelivery.deliveries.flatMap((deliveryDetails) => {
          const order = deliveryDetails.order;

          return order.items.map((item) => ({
            mealName: item.meal.name,
            mealQuantity: item.quantity,
            status: item.status,
            customerId: deliveryDetails.customer._id,
            customerName: deliveryDetails.customer.name,
          }));
        });

        return {
          deliveryId: outerDelivery._id,
          deliverStatus: outerDelivery.deliverStatus,
          deliveries: orders,
        };
      });

      return {
        title: new Date(delivery.title).toDateString(),
        deliveries: transformedDeliveries.filter((d) => !!d.deliveries.length),
      };
    }
  );

  return { data: transformedResponse };
}

export const useDeliveries = (
  kitchenId: string | undefined,
  params: DeliveriesParams,
  config: QueryOptions<TransformedDeliveries, IApiError> = {}
) => {
  const query = useQuery({
    queryKey: ["deliveries-data", params, kitchenId],
    enabled: !!kitchenId,
    queryFn: () => fetchDeliveriesData(kitchenId || "", params),
    ...config,
  });

  return query;
};
