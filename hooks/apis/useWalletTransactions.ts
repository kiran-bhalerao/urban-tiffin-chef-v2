import {
  InfiniteData,
  QueryKey,
  UndefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { axios, IApiError, IApiResponse } from "@/lib/axios";

export interface Transaction {
  _id: string;
  kitchenManager: string;
  wallet: string;
  transactionType: "wallet_credit" | "wallet_debit";
  amount: number;
  balance: number;
  creditSource: string;
  withdrawSource: string;
  meals: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface WalletTransactionsData {
  transactions: Transaction[];
}

async function getTransactions(kitchenManagerId = "", page = 1) {
  const endpoint = `/payments/kitchenManagers/transactions/getDetails?page=${page}&limit=10`;
  const res = await axios.post<IApiResponse<WalletTransactionsData>>(endpoint, {
    kitchenManagerId,
  });

  return {
    ...res.data,
    nextPage: res.data.data.transactions.length ? page + 1 : undefined,
  };
}

export const useWalletTransactions = (
  kitchenManagerId: string | undefined,
  config?: UndefinedInitialDataInfiniteOptions<
    IApiResponse<WalletTransactionsData>,
    IApiError,
    InfiniteData<IApiResponse<WalletTransactionsData>>,
    QueryKey,
    number
  >
) => {
  const query = useInfiniteQuery({
    queryKey: ["wallet-transactions"],
    queryFn: ({ pageParam }) => getTransactions(kitchenManagerId, pageParam),
    initialPageParam: 1,
    enabled: !!kitchenManagerId,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    ...(config || {}),
  });

  return query;
};
