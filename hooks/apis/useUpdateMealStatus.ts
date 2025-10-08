import { MutateOptions, useMutation } from "@tanstack/react-query";

import { axios, IApiError, IApiResponse } from "@/lib/axios";

interface UpdateMealStatusData {}

interface UpdateMealStatusParams {
  kitchenId: string;
  mealId: string;
  active: boolean;
}

async function updateDetails({
  kitchenId,
  mealId,
  active,
}: UpdateMealStatusParams) {
  const endpoint = `/kitchens/${kitchenId}/meals`;
  const res = await axios.patch<IApiResponse<UpdateMealStatusData>>(endpoint, {
    mealsAndStatus: [
      {
        mealId,
        active,
      },
    ],
  });

  return res.data;
}

export const useUpdateMealStatus = (
  config: MutateOptions<
    IApiResponse<UpdateMealStatusData>,
    IApiError,
    UpdateMealStatusParams
  > = {}
) => {
  const query = useMutation({
    mutationFn: updateDetails,
    ...config,
  });

  return query;
};
