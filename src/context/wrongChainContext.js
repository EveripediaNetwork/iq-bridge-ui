import { createContext } from "react";

export const WrongChainContext = createContext({
  openWrongChainModal: undefined,
  setOpenWrongChainModal: () => {}
});
