import { QueryOptions, useQuery } from "@tanstack/react-query";

import { axios, IApiError, IApiResponse } from "@/lib/axios";

interface Earnings {
  earning: number;
  orders: number;
}

interface EarningsData {
  today: Earnings;
  thisWeek: Earnings;
  thisMonth: Earnings;
  thisYear: Earnings;
  totalEarning: Earnings;
}

export async function fetchEarningsData(kitchenId: string) {
  const endpoint = `/kitchens/${kitchenId}/kitchenEarnings`;
  const res = await axios.get<IApiResponse<EarningsData>>(endpoint);

  return res.data;
}

export const useEarnings = (
  kitchenId: string | undefined,
  config: QueryOptions<IApiResponse<EarningsData>, IApiError> = {}
) => {
  const query = useQuery({
    queryKey: ["earnings-data", kitchenId],
    enabled: !!kitchenId,
    queryFn: () => fetchEarningsData(kitchenId || ""),
    ...config,
  });

  return query;
};
