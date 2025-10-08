import { QueryOptions, useQuery } from "@tanstack/react-query";

import { axios, IApiError, IApiResponse } from "@/lib/axios";

interface DashboardData {
  allOrders: {
    lunch: number;
    dinner: number;
    breakfast: number;
  };
  orderStatus: {
    totalOrders: number;
    deliveredOrders: number;
    processingOrders: number;
  };
}

export async function fetchDashboardData(kitchenId: string) {
  const endpoint = `/kitchens/${kitchenId}/dashboard`;
  const res = await axios.get<IApiResponse<DashboardData>>(endpoint);

  return res.data;
}

export const useDashboard = (
  kitchenId: string | undefined,
  config: QueryOptions<IApiResponse<DashboardData>, IApiError> = {}
) => {
  const query = useQuery({
    queryKey: ["dashboard-data", kitchenId],
    enabled: !!kitchenId,
    queryFn: () => fetchDashboardData(kitchenId || ""),
    ...config,
  });

  return query;
};
