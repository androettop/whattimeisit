import { useCallback, useRef } from "react";

const useStaticHandler = (handler: Function) => {
  const ref = useRef((() => {}) as Function);
  ref.current = handler;
  return useCallback((...args: unknown[]) => ref.current(...args), [ref]);
};

export default useStaticHandler;
