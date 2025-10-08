import {
  InfiniteData,
  QueryKey,
  UndefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { axios, IApiError, IApiResponse } from "@/lib/axios";

interface OrderHistoryData {
  history: {
    [dateTime: string]: {
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
          __v: number;
        };
        customer: {
          _id: string;
          name: string;
        };
      }[];
      deliverStatus: string;
      mealTime: string;
    }[];
  };
}

export interface TransformedDeliveriesOrders {
  orders: {
    deliveryId: string;
    deliverStatus: string;
    deliveryDate: string;
    deliveries: {
      mealId: string;
      mealName: string;
      mealQuantity: number;
      mealTime: string;
      mealItems: {
        name: string;
        units: string;
        unitLabel: string;
        order: number;
      }[];
      price: number;
      mealDescription: string;
      orderId: string;
      customerId: string;
      customerName: string;
    }[];
  }[];
  nextPage: number | undefined;
}

async function orderHistory(
  kitchenId = "",
  page = 1
): Promise<TransformedDeliveriesOrders> {
  const endpoint = `/kitchens/${kitchenId}/kitchenOrders`;
  const res = await axios.get<IApiResponse<OrderHistoryData>>(endpoint, {
    params: { page, limit: 10 },
  });

  const transformedResponse = Object.entries(res.data.data?.history)?.flatMap(
    ([date, deliveries]) => {
      return deliveries.map((outerDelivery) => {
        const orders = outerDelivery.deliveries.flatMap((deliveryDetails) => {
          return deliveryDetails.order.items.map((item) => ({
            mealId: item.meal._id,
            mealName: item.meal.name,
            mealQuantity: item.meal.quantity,
            mealTime: item.mealTime,
            mealItems: item.meal.mealItems,
            price: item.meal.price,
            mealDescription: item.meal.description,
            orderId: deliveryDetails.order._id,
            customerId: deliveryDetails.customer._id,
            customerName: deliveryDetails.customer.name,
          }));
        });

        // Split the date and time part
        const [datePart, timePart] = date.split(",");
        const [day, month, year] = datePart.split("/").map(Number);

        // Extract hours, minutes, and seconds from timePart
        const [time, period] = timePart.trim().split(" ");
        let [hours, minutes, seconds] = time.split(":").map(Number);

        // Adjust hours for AM/PM
        if (period.toLowerCase() === "pm" && hours < 12) {
          hours += 12; // Convert PM hour to 24-hour format
        } else if (period.toLowerCase() === "am" && hours === 12) {
          hours = 0; // Convert 12 AM to 0 hours
        }

        // Create a new Date object with date and time
        const deliveryDate = new Date(
          year,
          month - 1,
          day,
          hours,
          minutes,
          seconds
        ).toString();

        return {
          deliveryId: outerDelivery._id,
          deliverStatus: outerDelivery.deliverStatus,
          deliveryDate,
          deliveries: orders,
        };
      });
    }
  );

  return {
    orders: transformedResponse,
    nextPage: Object.keys(res.data.data.history || {}).length
      ? page + 1
      : undefined,
  };
}

export const useOrderHistory = (
  kitchenId: string | undefined,
  config?: UndefinedInitialDataInfiniteOptions<
    TransformedDeliveriesOrders,
    IApiError,
    InfiniteData<TransformedDeliveriesOrders>,
    QueryKey,
    number
  >
) => {
  const query = useInfiniteQuery({
    queryKey: ["order-history"],
    queryFn: ({ pageParam }) => orderHistory(kitchenId, pageParam),
    initialPageParam: 1,
    enabled: !!kitchenId,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    ...(config || {}),
  });

  return query;
};
