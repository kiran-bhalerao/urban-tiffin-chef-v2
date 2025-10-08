import { QueryOptions, useQuery } from "@tanstack/react-query";

import { axios, IApiError, IApiResponse } from "@/lib/axios";
import { formateFullDate } from "@/lib/formate_full_date";

interface ScheduleMeal {
  date: string;
  mealscheduleId: string;
  menu: {
    _id: string;
    name: string;
    mealItems: {
      name: string;
      units: string;
      unitLabel: string;
      order: number;
      _id: string;
    }[];
    images: string[];
    kitchen: string;
    mealTime: string[];
    price: number;
    orders?: number;
    mealPreference: string;
    mealScheduleId: string;
    description: string;
  }[];
}

interface KitchenMealSchedulesData {
  scheduleMeals: ScheduleMeal[];
}

export interface TransformedKitchenMealSchedules {
  dates: {
    date: Date;
    weekday: string;
    day: string;
    raw: string;
  }[];
  meals: {
    id: string;
    title: string;
    price: number;
    mealPreference: string;
    orders?: number;
    description: string;
    mealItems: {
      name: string;
      units: string;
      unitLabel: string;
      order: number;
      _id: string;
    }[];
    mealTime: string[];
    _mealTime: string;
  }[];
}

async function getMeals(kitchenId: string) {
  const endpoint = `/kitchens/${kitchenId}/mealSchedules`;
  const response = await axios.get<IApiResponse<KitchenMealSchedulesData>>(
    endpoint
  );

  return response.data;
}

interface KitchenMealSchedulesTransformParams {
  language: string;
  activeDay: string | undefined;
  mealTime: "breakfast" | "lunch" | "dinner";
  scheduleMeals: KitchenMealSchedulesData["scheduleMeals"] | undefined;
}

export const transformMealSchedules = (
  params: KitchenMealSchedulesTransformParams
) => {
  const scheduleMeals = params.scheduleMeals || [];

  // Collect the dates for all menu data
  const dates = scheduleMeals.map((d) => d.date);
  const activeDay = params.activeDay || dates[0];

  // Find the meals for the active day
  const meals = scheduleMeals.find((w) => w.date === activeDay)?.menu || [];

  // Function to filter meals based on the provided meal time
  const filterMealsByTime = (time: string) =>
    meals
      .filter((d) => d.mealTime.map((m) => m.toLowerCase()).includes(time))
      .map((_d) => ({
        id: _d._id,
        title: _d.name,
        price: _d.price,
        mealTime: _d.mealTime,
        mealPreference: _d.mealPreference,
        mealItems: _d.mealItems,
        _mealTime: time,
        description:
          _d.description || _d.mealItems.map((m) => m.name).join(" + "),
      }));

  return {
    meals: filterMealsByTime(params.mealTime) || [],
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

export const useKitchenMealSchedules = (
  kitchenId: string,
  config: QueryOptions<IApiResponse<KitchenMealSchedulesData>, IApiError> = {}
) => {
  const query = useQuery({
    queryKey: ["kitchens-meal-schedules", kitchenId],
    queryFn: () => getMeals(kitchenId),
    placeholderData: (d) => d,
    ...config,
  });

  return query;
};
