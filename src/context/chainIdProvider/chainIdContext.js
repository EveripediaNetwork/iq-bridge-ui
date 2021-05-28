import { createContext } from "react";

export const ChainIdContext = createContext({
  currentChainId: 1,
  setCurrentChainId: () => {}
});
