import { MutateOptions, useMutation } from "@tanstack/react-query";

import { axios, IApiError, IApiResponse } from "@/lib/axios";

interface UpdateKitchenConfigData {}

interface UpdateKitchenConfigParams {
  kitchenId: string;
  acceptingOrders?: boolean;
  defaultLanguage?: string;
}

async function updateDetails({
  kitchenId,
  ...params
}: UpdateKitchenConfigParams) {
  const endpoint = `/kitchens/${kitchenId}/config`;
  const res = await axios.patch<IApiResponse<UpdateKitchenConfigData>>(
    endpoint,
    params
  );

  return res.data;
}

export const useUpdateKitchenConfig = (
  config: MutateOptions<
    IApiResponse<UpdateKitchenConfigData>,
    IApiError,
    UpdateKitchenConfigParams
  > = {}
) => {
  const query = useMutation({
    mutationFn: updateDetails,
    ...config,
  });

  return query;
};
