import React, { memo, useContext, useState, useEffect } from "react";
import {
  Card,
  Form,
  ToggleButtonGroup,
  ToggleButton,
  Button
} from "react-bootstrap";
import { Lock } from "react-bootstrap-icons";
import { useWallet } from "use-wallet";
import styled from "styled-components";

import { getLpTokenBalance } from "../../utils/EthDataProvider/GaugesDataProvider";
import { GaugesContext } from "../../context/gaugesContext";

const LpTokensInput = styled(Form.Control)`
  :focus {
    box-shadow: none !important;
  }
`;

const StyledToggleButton = styled(ToggleButton)`
  border-radius: 0px !important;
  font-size: 12px !important;
`;

const LPLock = () => {
  const wallet = useWallet();
  const { gauges } = useContext(GaugesContext);
  const [selectedGaugeIdx, setSelectedGaugeIdx] = useState(0);
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    if (gauges) {
      (async () => {
        for (let i = 0; i < gauges.length; i++) {
          const lpBalance = await getLpTokenBalance(
            wallet,
            gauges[i].lpAddress
          );

          setBalances(prev => [...prev, lpBalance]);
        }
      })();
    }
  }, [gauges]);

  return (
    <Card
      style={{ width: 300 }}
      className="p-2 d-flex flex-column justify-content-center align-items-center"
    >
      <Card.Title>Lock LP Tokens</Card.Title>
      <ToggleButtonGroup
        name="group"
        className="mb-3 p-0 mt-2 d-flex flex-row flex-nowrap justify-content-center container w-100"
        value={selectedGaugeIdx}
        onChange={setSelectedGaugeIdx}
        type="radio"
      >
        {gauges
          ? gauges.map((g, index) => (
              <StyledToggleButton
                size="sm"
                name="amount"
                variant="outline-primary"
                value={index}
              >
                {g.name}
              </StyledToggleButton>
            ))
          : null}
      </ToggleButtonGroup>
      <span>Max available: {balances[selectedGaugeIdx] || 0} LP</span>
      <LpTokensInput
        disabled={balances.length === 0 || balances[selectedGaugeIdx] === 0}
        placeholder="0.0"
        className="mb-2 w-75"
      />
      <Button
        disabled={balances.length === 0 || balances[selectedGaugeIdx] === 0}
        variant="outline-success"
        className="text-capitalize w-25 font-weight-bold shadow-sm"
        type="submit"
        size="sm"
      >
        <Lock />
      </Button>
    </Card>
  );
};

export default memo(LPLock);
