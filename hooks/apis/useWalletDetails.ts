import { QueryOptions, useQuery } from "@tanstack/react-query";

import { axios, IApiError, IApiResponse } from "@/lib/axios";

export interface WalletDetailsData {
  wallet?: {
    _id: string;
    kitchenManager: string;
    balance: number;
  };
}

export async function fetchWalletDetailsData(kitchenManagerId: string) {
  const endpoint = "/payments/kitchenManagers/wallets/getDetails";
  const res = await axios.post<IApiResponse<WalletDetailsData>>(endpoint, {
    kitchenManagerId,
  });

  return res.data;
}

export const useWalletDetails = (
  kitchenManagerId: string | undefined,
  config: QueryOptions<IApiResponse<WalletDetailsData>, IApiError> = {}
) => {
  const query = useQuery({
    queryKey: ["wallet-details", kitchenManagerId],
    enabled: !!kitchenManagerId,
    queryFn: () => fetchWalletDetailsData(kitchenManagerId || ""),
    ...config,
  });

  return query;
};
