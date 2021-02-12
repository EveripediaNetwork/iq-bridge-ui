import React, { createContext, useReducer, useContext } from "react";
import PropTypes from "prop-types";
import tokensReducer from "./tokensReducer";

const TokensStateContext = createContext(undefined);
const TokensDispatchContext = createContext(undefined);

const TokensProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tokensReducer, {
    tokens: [],
  });

  return (
    <TokensStateContext.Provider value={state}>
      <TokensDispatchContext.Provider value={dispatch}>
        {children}
      </TokensDispatchContext.Provider>
    </TokensStateContext.Provider>
  );
};

TokensProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useTokensState = () => {
  const context = useContext(TokensStateContext);
  if (context === undefined) {
    throw new Error("useTokensState must be used within a TokensProvider");
  }
  return context;
};

const useTokensDispatch = () => {
  const context = useContext(TokensDispatchContext);
  if (context === undefined) {
    throw new Error("useTokensDispatch must be used within a TokensProvider");
  }
  return context;
};

export { TokensProvider, useTokensState, useTokensDispatch };
