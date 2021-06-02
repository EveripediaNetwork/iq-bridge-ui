import { createContext } from "react";

export const ChainIdContext = createContext({
  currentChainId: undefined,
  setCurrentChainId: () => {}
});
