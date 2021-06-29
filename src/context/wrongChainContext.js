import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useWallet } from "use-wallet";

export const WrongChainContext = createContext({
  openWrongChainDialog: false,
  setOpenWrongChainDialog: () => {}
});

export const WrongChainProvider = ({ children }) => {
  const wallet = useWallet();

  const setOpenWrongChainDialog = open => {
    // eslint-disable-next-line no-use-before-define
    setWrongChainState({ ...wrongChainState, openWrongChainDialog: open });
  };

  const initState = {
    openWrongChainDialog: false,
    setOpenWrongChainDialog
  };

  const [wrongChainState, setWrongChainState] = useState(initState);

  useEffect(() => {
    if (wallet.status === "error" && wallet.account === null) {
      setWrongChainState({
        ...wrongChainState,
        openWrongChainDialog: true
      });
    }
  }, [wallet.status]);

  return (
    <WrongChainContext.Provider value={wrongChainState}>
      {children}
    </WrongChainContext.Provider>
  );
};

WrongChainProvider.propTypes = {
  children: PropTypes.node.isRequired
};
