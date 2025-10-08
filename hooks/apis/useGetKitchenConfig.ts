import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { axios, IApiError, IApiResponse } from "@/lib/axios";

interface GetKitchenConfigData {
  defaultLanguage: string;
  acceptingOrders: boolean;
}

export async function fetchGetKitchenConfigData(kitchenId: string) {
  const endpoint = `/kitchens/${kitchenId}/config`;
  const res = await axios.get<IApiResponse<GetKitchenConfigData>>(endpoint);

  return res.data;
}

export const useGetKitchenConfig = (
  kitchenId: string | undefined,
  config: Omit<
    UseQueryOptions<
      IApiResponse<GetKitchenConfigData>,
      IApiError,
      IApiResponse<GetKitchenConfigData>,
      any
    >,
    "queryKey"
  > = {}
) => {
  const query = useQuery({
    queryKey: ["kitchens-config", kitchenId],
    enabled: !!kitchenId,
    queryFn: () => fetchGetKitchenConfigData(kitchenId || ""),
    ...config,
  });

  return query;
};
