import { axios, IApiError, IApiResponse } from "@/lib/axios";
import { MutateOptions, useMutation } from "@tanstack/react-query";

interface OtpData {
  _id: string;
  mobile: number;
  service: string;
  otp: number;
}

async function genOtp(mobile: string) {
  const endpoint = "/auth/getOtp";
  const res = await axios.post<IApiResponse<OtpData>>(endpoint, {
    mobile,
    userType: "kitchenManager",
    service: "kitchenManagerLogin",
  });

  return res.data;
}

export const useGenOtp = (
  config: MutateOptions<
    IApiResponse<OtpData>,
    IApiError,
    { mobile: string }
  > = {}
) => {
  const query = useMutation({
    mutationFn: ({ mobile }) => genOtp(mobile),
    retry: false,
    ...config,
  });

  return query;
};
