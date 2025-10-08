import React from "react";

type UseEffectWhenCallback = () => void;

export const useEffectWhen = (
  callback: UseEffectWhenCallback,
  when: boolean
): void => {
  const hasRunOnce = React.useRef(false);

  React.useEffect(() => {
    if (when && !hasRunOnce.current) {
      callback();
      hasRunOnce.current = true;
    }
  }, [when, callback]);
};
