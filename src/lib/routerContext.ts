import { createContext, useContext } from "react";

export type RouterValue = {
  path: string;
  navigate: (to: string) => void;
};

export const RouterContext = createContext<RouterValue>({
  path: "/",
  navigate: () => {},
});

export function useRouter() {
  return useContext(RouterContext);
}
