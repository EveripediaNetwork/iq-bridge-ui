import React, { createContext, useReducer, useContext } from "react";
import PropTypes from "prop-types";
import userTokensReducer from "./userTokensReducer";

const UserTokensStateContext = createContext(undefined);
const UserTokensDispatchContext = createContext(undefined);

const UserTokensProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userTokensReducer, {
    userTokens: [],
  });

  return (
    <UserTokensStateContext.Provider value={state}>
      <UserTokensDispatchContext.Provider value={dispatch}>
        {children}
      </UserTokensDispatchContext.Provider>
    </UserTokensStateContext.Provider>
  );
};

UserTokensProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useUserTokensState = () => {
  const context = useContext(UserTokensStateContext);
  if (context === undefined) {
    throw new Error(
      "useUserTokensState must be used within a UserTokensProvider"
    );
  }
  return context;
};

const useUserTokensDispatch = () => {
  const context = useContext(UserTokensDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useUserTokensDispatch must be used within a UserTokensProvider"
    );
  }
  return context;
};

export { UserTokensProvider, useUserTokensState, useUserTokensDispatch };
