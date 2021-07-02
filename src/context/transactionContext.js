import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

export const TransactionContext = createContext({
  openTxDetails: false,
  setOpenTxDetails: () => {},
  hashes: [],
  setHashes: () => {},
  txDone: false,
  setTxDone: () => {}
});

export const TransactionProvider = ({ children }) => {
  const setHashes = newHashes => {
    // eslint-disable-next-line no-use-before-define
    const newArr = [...txState.hashes, ...newHashes].slice(-5);
    // eslint-disable-next-line no-use-before-define
    setTxState({ ...txState.hashes, hashes: newArr });
    localStorage.setItem("lastFiveTx", JSON.stringify(newArr));

    // console.log(newArr);
    // eslint-disable-next-line no-use-before-define
    // console.log(txState.hashes);
  };

  const setOpenTxDetails = open => {
    // eslint-disable-next-line no-use-before-define
    setTxState({ ...txState, openTxDetails: open });
  };

  const setTxDone = done => {
    // eslint-disable-next-line no-use-before-define
    setTxState({ ...txState, txDone: done });
  };

  const initState = {
    hashes: JSON.parse(localStorage.getItem("lastFiveTx")) || [],
    setHashes,
    openTxDetails: false,
    setOpenTxDetails,
    txDone: false,
    setTxDone
  };

  const [txState, setTxState] = useState(initState);

  return (
    <TransactionContext.Provider value={txState}>
      {children}
    </TransactionContext.Provider>
  );
};

TransactionProvider.propTypes = {
  children: PropTypes.node.isRequired
};
