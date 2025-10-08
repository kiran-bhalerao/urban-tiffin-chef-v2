import { MutateOptions, useMutation } from "@tanstack/react-query";

import { axios, IApiError, IApiResponse } from "@/lib/axios";
import { IUser } from "@/store/useAppStore";

interface VerifyData {
  token: string;
  user: IUser;
  kitchen: {
    _id: string;
    name: string;
    bId: string;
    tags: string[];
    images: string[];
    address: string;
    kitchenHub: string;
    timings: string[];
    rating: number;
    cuisines: string[];
    dietaryTypes: string[];
    active: boolean;
    contacts: any[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    kitchenManager: string;
    image: string;
    descriptions: string;
    description: string;
  };
}

interface VerifyOtpParams {
  _id: string;
  mobile: number;
  otp: number;
}

async function verifyOtp(params: VerifyOtpParams) {
  const endpoint = "/auth/kitchenManagers/login";
  const res = await axios.post<IApiResponse<VerifyData>>(endpoint, {
    userType: "kitchenManager",
    service: "kitchenManagerLogin",
    ...params,
  });

  return res.data;
}

export const useVerifyOtp = (
  config: MutateOptions<
    IApiResponse<VerifyData>,
    IApiError,
    VerifyOtpParams
  > = {}
) => {
  const query = useMutation({
    mutationFn: verifyOtp,
    ...config,
  });

  return query;
};
