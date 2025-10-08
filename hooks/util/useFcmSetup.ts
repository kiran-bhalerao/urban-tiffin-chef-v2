import { useSaveFcmToken } from "@/hooks/apis/useSaveFcmToken";
import { useAppStore } from "@/store/useAppStore";
import messaging from "@react-native-firebase/messaging";
import { useEffect, useRef } from "react";
import { toast } from "sonner-native";

export const useFcmSetup = () => {
  const prevMessageIdRef = useRef<null | string>();

  useEffect(() => {
    const unsubscribe = messaging().onMessage((msg) => {
      if (!!msg.notification?.title || !!msg.notification?.body) {
        if (prevMessageIdRef.current !== msg.messageId) {
          toast.info(msg.notification?.title || "", {
            description: msg.notification?.body,
          });
        }

        prevMessageIdRef.current = msg.messageId;
      }
    });

    return unsubscribe;
  }, []);

  const { mutate } = useSaveFcmToken();
  useEffect(() => {
    try {
      const kitchenManagerId =
        useAppStore.getState().user?.kitchen.kitchenManager;
      if (kitchenManagerId) {
        void messaging()
          .getToken()
          .then((token) => {
            mutate({ firebaseToken: token, kitchenManagerId });
          });
      }
    } catch {
      // Ignore
    }
  }, [mutate]);
};
