import { QueryOptions, useQuery } from "@tanstack/react-query";

import { axios, IApiError, IApiResponse } from "@/lib/axios";

export interface BankDetailsData {
  _id: string;
  kitchenManager: string;
  bankName: string;
  branch: string;
  lf: string;
  upi: string;
  ifsc: string;
  micr: string;
  paymentMode: "bank" | "upi";
  createdAt: string;
  updatedAt: string;
}

export async function fetchBankDetailsData(kitchenManagerId: string) {
  const endpoint = "/payments/kitchenManagers/accounts/getAccountsDetails";
  const res = await axios.post<IApiResponse<BankDetailsData>>(endpoint, {
    kitchenManagerId,
  });

  return res.data;
}

export const useBankDetails = (
  kitchenManagerId: string | undefined,
  config: QueryOptions<IApiResponse<BankDetailsData>, IApiError> = {}
) => {
  const query = useQuery({
    queryKey: ["banking-data", kitchenManagerId],
    enabled: !!kitchenManagerId,
    queryFn: () => fetchBankDetailsData(kitchenManagerId || ""),
    ...config,
  });

  return query;
};
