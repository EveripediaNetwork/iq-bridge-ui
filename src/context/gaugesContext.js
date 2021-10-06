import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

export const GaugesContext = createContext(null);

export const GaugesProvider = ({ children }) => {
  const [gaugesState, setGaugesState] = useState({
    gauges: undefined,
    setGauges: newGauges =>
      setGaugesState({ ...gaugesState, gauges: newGauges })
  });

  return (
    <GaugesContext.Provider value={gaugesState}>
      {children}
    </GaugesContext.Provider>
  );
};

GaugesProvider.propTypes = {
  children: PropTypes.node.isRequired
};
