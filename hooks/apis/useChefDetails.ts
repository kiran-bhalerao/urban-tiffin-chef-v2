import { QueryOptions, useQuery } from "@tanstack/react-query";

import { axios, IApiError, IApiResponse } from "@/lib/axios";
import { IUser } from "@/store/useAppStore";

interface ChefDetailsData {
  chef: {
    _id: string;
    name: string;
    profilePic: string;
    email: string;
    mobile: number;
    gender: string;
    dob: any;
    kitchen: {
      _id: string;
      name: string;
      images: string[];
      rating: number;
      active: boolean;
      fssaiNo: string;
      fssaiCertificate: string;
    };
    mobileVerified: boolean;
    emailVerified: boolean;
    active: boolean;
  };
}

export async function fetchChefDetailsData(user: IUser | undefined) {
  const endpoint = `/kitchens/${user?.kitchen._id}/kitchenManagers/${user?.kitchen.kitchenManager}`;
  const {
    data: { data },
  } = await axios.get<IApiResponse<ChefDetailsData>>(endpoint);

  return {
    ...user, // Spread old IUser data first
    _id: data.chef._id,
    mobile: data.chef.mobile,
    email: data.chef.email,
    fssai: data.chef.kitchen.fssaiNo,
    emailVerified: data.chef.emailVerified,
    name: data.chef.name,
    kitchen: {
      ...user?.kitchen, // Spread old kitchen data first
      _id: data.chef.kitchen._id,
      name: data.chef.kitchen.name,
      kitchenHub: data.chef.kitchen.fssaiCertificate,
      rating: data.chef.kitchen.rating,
      active: data.chef.kitchen.active,
      contacts: user?.kitchen.contacts || [], // Preserve old contacts or initialize as empty
      kitchenManager: user?.kitchen.kitchenManager || "", // Preserve old kitchenManager if available
      image: data.chef.kitchen.images[0] || user?.kitchen.image || "", // Use first new image if available
      descriptions: user?.kitchen.descriptions || "", // Preserve old descriptions if available
      description: user?.kitchen.description || "", // Preserve old description if available
    },
  };
}

export const useChefDetails = (
  user: IUser | undefined,
  config: QueryOptions<IUser, IApiError> = {}
) => {
  const query = useQuery({
    queryKey: ["chef-data", user?.kitchen?._id],
    enabled: !!user?.kitchen?._id,
    queryFn: () => fetchChefDetailsData(user),
    ...config,
  });

  return query;
};
