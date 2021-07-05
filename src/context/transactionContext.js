import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const setTxDone = done => {
    // eslint-disable-next-line no-use-before-define
    setTxState({ ...txState, txDone: done });
  };

  const [txState, setTxState] = useState({
    hashes: JSON.parse(localStorage.getItem("lastFiveTx")) || [],
    setHashes: newHashes => {
      let newArr = [...txState.hashes, ...newHashes];

      newArr = newArr.slice(Math.max(newArr.length - 5, 0));

      localStorage.setItem("lastFiveTx", JSON.stringify(newArr));

      return setTxState(prev => ({
        ...prev,
        hashes: newArr
      }));
    },
    txDone: false,
    setTxDone
  });

  return (
    <TransactionContext.Provider value={txState}>
      {children}
    </TransactionContext.Provider>
  );
};

TransactionProvider.propTypes = {
  children: PropTypes.node.isRequired
};
