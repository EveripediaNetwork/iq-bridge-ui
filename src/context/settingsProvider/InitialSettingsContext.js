import React, { createContext } from "react";
import { defaultSlippagePercentage } from "../../constants/index";

const SlippageContext = createContext({
  slippageLimit: defaultSlippagePercentage,
  setSlippageLimit: () => {} // TODO: TOdO
});

export default SlippageContext;
