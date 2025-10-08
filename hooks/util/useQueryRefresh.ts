import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export const useQueryRefresh = () => {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    void queryClient.refetchQueries();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [queryClient]);

  return {
    refreshing,
    onRefresh,
  };
};
