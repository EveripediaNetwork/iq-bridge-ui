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
import { CashCoin } from "react-bootstrap-icons";

import {
  getLockedStakes,
  getLpTokenBalance,
  stakeLockedLP
} from "../../../utils/EthDataProvider/GaugesDataProvider";
import { GaugesContext } from "../../../context/gaugesContext";
import StyledSlider from "../../../components/ui/styledSlider";
import LockedStagesList from "./lockedStagesList";

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
  const [inputLPTokens, setInputLPTokens] = useState();
  const [lockTime, setLockTime] = useState();
  const [lockedStakes, setLockedStakes] = useState([]);
  const [showLockedStakes, setShowLockedStakes] = useState(false);

  const lockLpTokens = async () => {
    console.log(`SELECTED GAUGE: ${JSON.stringify(gauges[selectedGaugeIdx])}`);
    console.log(`INPUT LP: ${inputLPTokens}`);
    console.log(`LOCK TIME: ${lockTime}`);

    await stakeLockedLP(
      wallet,
      inputLPTokens,
      lockTime * 86400,
      gauges[selectedGaugeIdx].lpAddress,
      gauges[selectedGaugeIdx].address
    );
  };

  const handleLockedStakes = (gauge, stakes) =>
    setLockedStakes(prev => [...prev, { gaugeName: gauge.name, stakes }]);

  useEffect(() => {
    if (gauges) {
      (async () => {
        for (let i = 0; i < gauges.length; i++) {
          const lpBalance = await getLpTokenBalance(
            wallet,
            gauges[i].lpAddress
          );

          setBalances(prev => [...prev, lpBalance]);

          const stakes = await getLockedStakes(wallet, gauges[i].address);
          console.log(stakes);
          handleLockedStakes(gauges[i], stakes);
        }
      })();
    }
  }, [gauges]);

  return (
    <Card
      style={{ width: 300, height: 430, maxHeight: 430, overflowY: "auto" }}
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
                key={index}
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
        onChange={event => setInputLPTokens(Number(event.target.value))}
      />
      <div className="d-flex flex-column justify-content-center align-items-center p-3 w-100">
        <h6 className="text-center">
          Lock duration <br /> (min 1 day - max 3 years)
        </h6>
        <StyledSlider onChange={setLockTime} min={1} max={1095} />
      </div>
      <Button
        disabled={
          balances.length === 0 ||
          balances[selectedGaugeIdx] === 0 ||
          !gauges ||
          !inputLPTokens ||
          inputLPTokens <= 0 ||
          !lockTime
        }
        variant="success"
        className="text-capitalize w-25 font-weight-bold shadow-sm"
        type="submit"
        size="sm"
        onClick={lockLpTokens}
      >
        <Lock />
      </Button>
      <br />
      <Button
        variant="warning"
        className="monospace"
        onClick={() => setShowLockedStakes(true)}
      >
        <strong>
          {" "}
          Stakes and Rewards <CashCoin className="ml-2" />
        </strong>
      </Button>
      {lockedStakes &&
      lockedStakes.length > 0 &&
      lockedStakes[selectedGaugeIdx].stakes !== undefined ? (
        <LockedStagesList
          show={showLockedStakes}
          setShow={setShowLockedStakes}
          lockedStakes={lockedStakes[selectedGaugeIdx]}
          gaugeIdx={selectedGaugeIdx}
        />
      ) : null}
    </Card>
  );
};

export default memo(LPLock);
