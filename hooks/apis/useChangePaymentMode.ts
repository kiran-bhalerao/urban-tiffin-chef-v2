import { MutateOptions, useMutation } from "@tanstack/react-query";

import { axios, IApiError, IApiResponse } from "@/lib/axios";

interface ChangePaymentModeData {}

interface ChangePaymentModeParams {
  kitchenManagerId: string;
  paymentMode: "bank" | "upi";
}

async function updateDetails(params: ChangePaymentModeParams) {
  const endpoint = "/payments/kitchenManagers/accounts/addAccountsDetails";
  const res = await axios.patch<IApiResponse<ChangePaymentModeData>>(
    endpoint,
    params
  );

  return res.data;
}

export const useChangePaymentMode = (
  config: MutateOptions<
    IApiResponse<ChangePaymentModeData>,
    IApiError,
    ChangePaymentModeParams
  > = {}
) => {
  const query = useMutation({
    mutationFn: updateDetails,
    ...config,
  });

  return query;
};
