import { MutateOptions, useMutation } from "@tanstack/react-query";

import { axios, IApiError, IApiResponse } from "@/lib/axios";

interface UpdateDeliveryStatusData {}

interface UpdateDeliveryStatusParams {
  kitchenId: string;
  deliveryId: string;
  status: "processing" | "delivered" | "undelivered";
}

async function updateDetails({
  kitchenId,
  deliveryId,
  ...params
}: UpdateDeliveryStatusParams) {
  const endpoint = `/kitchens/${kitchenId}/kitchenDeliveries/${deliveryId}/status`;
  const res = await axios.patch<IApiResponse<UpdateDeliveryStatusData>>(
    endpoint,
    params
  );

  return res.data;
}

export const useUpdateDeliveryStatus = (
  config: MutateOptions<
    IApiResponse<UpdateDeliveryStatusData>,
    IApiError,
    UpdateDeliveryStatusParams
  > = {}
) => {
  const query = useMutation({
    mutationFn: updateDetails,
    ...config,
  });

  return query;
};
