import { QueryOptions, useQuery } from "@tanstack/react-query";

import { axios, IApiError, IApiResponse } from "@/lib/axios";

export interface KitchenMealsData {
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
  active?: boolean;
  mealCategories: string[];
  quantity: number;
  rating: number;
}

export async function fetchKitchenMealsData(kitchenId: string) {
  const endpoint = `/kitchens/${kitchenId}/meals`;
  const res = await axios.get<IApiResponse<KitchenMealsData[]>>(endpoint);

  return res.data;
}

export const useKitchenMeals = (
  kitchenId: string | undefined,
  config: QueryOptions<IApiResponse<KitchenMealsData[]>, IApiError> = {}
) => {
  const query = useQuery({
    queryKey: ["kitchen-meals", kitchenId],
    enabled: !!kitchenId,
    queryFn: () => fetchKitchenMealsData(kitchenId || ""),
    ...config,
  });

  return query;
};
