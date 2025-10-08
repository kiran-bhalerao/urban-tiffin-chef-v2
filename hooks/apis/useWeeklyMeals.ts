import { QueryOptions, useQuery } from "@tanstack/react-query";

import { axios, IApiError, IApiResponse } from "@/lib/axios";
import { formateFullDate } from "@/lib/formate_full_date";

interface KitchensWeeklyMealsData {
  weeklyOrders: Record<
    string,
    {
      meals: {
        name: string;
        quantity: number;
        mealTime: string;
        mealPreference: string;
        mealItems?: {
          name: string;
          units: string;
          date: string;
          unitLabel: string;
        }[];
      }[];
      mealItems: {
        name: string;
        units: string;
        date: string;
        unitLabel: string;
      }[];
    }
  >;
}

async function getMeals(
  kitchenId = "",
  mealTime: "breakfast" | "lunch" | "dinner"
) {
  const endpoint = `/kitchens/${kitchenId}/weeklyOrders`;
  const response = await axios.get<IApiResponse<KitchensWeeklyMealsData>>(
    endpoint,
    { params: { mealTime } }
  );

  return response.data;
}

export interface TransformedKitchensWeeklyMeals {
  dates: {
    date: Date;
    weekday: string;
    day: string;
    raw: string;
  }[];
  meals: {
    name: string;
    quantity: number;
    mealTime: string;
    mealPreference: string;
    mealItems?: {
      name: string;
      units: string;
      date: string;
      unitLabel: string;
    }[];
  }[];
  mealItems: {
    name: string;
    units: string;
    date: string;
    unitLabel: string;
  }[];
}

interface KitchenMealSchedulesTransformParams {
  language: string;
  activeDay: string | undefined;
  weeklyMeals: KitchensWeeklyMealsData["weeklyOrders"] | undefined;
}

export const transformKitchensWeeklyMeals = (
  params: KitchenMealSchedulesTransformParams
) => {
  // Collect the dates for all menu data
  const dates = Object.keys(params.weeklyMeals || {});
  const activeDay = params.activeDay || dates[0];

  const meals = params.weeklyMeals?.[activeDay]?.meals || [];
  const mealItems = params.weeklyMeals?.[activeDay]?.mealItems || [];

  return {
    meals,
    mealItems,
    dates:
      dates.map((d) => {
        const date = new Date(d);

        return {
          date,
          weekday: formateFullDate(date.toString(), params.language, {
            weekday: "short",
          }),
          day: formateFullDate(date.toString(), params.language, {
            day: "numeric",
            month: "short",
          }),
          raw: d,
        };
      }) || [],
  };
};

export const useKitchensWeeklyMeals = (
  kitchenId: string | undefined,
  mealTime: "breakfast" | "lunch" | "dinner",
  config: QueryOptions<IApiResponse<KitchensWeeklyMealsData>, IApiError> = {}
) => {
  const query = useQuery({
    queryKey: ["kitchens-weekly-meal", mealTime, kitchenId],
    queryFn: () => getMeals(kitchenId, mealTime),
    placeholderData: (d) => d,
    enabled: !!kitchenId,
    ...config,
  });

  return query;
};
