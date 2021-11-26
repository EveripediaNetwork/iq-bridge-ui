import React, { memo, useContext, useState, useEffect, useRef } from "react";
import {
  Card,
  Form,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Col,
  Row,
  Spinner
} from "react-bootstrap";
import { useWallet } from "use-wallet";
import { CashCoin, Lock } from "react-bootstrap-icons";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import InputSpinner from "react-bootstrap-input-spinner";

import {
  getLockedStakes,
  getLpTokenBalance,
  stakeLockedLP
} from "../../../utils/EthDataProvider/GaugesDataProvider";
import { GaugesContext } from "../../../context/gaugesContext";
import StyledSlider from "../../../components/ui/styledSlider";
import LockedStakesList from "./lockedStakesList";
import ViewInExplorerBtn from "../../../components/ui/viewInExplorerBtn";

const StyledCard = styled(Card)`
  border: 0.5px solid whitesmoke !important;
  width: 300px;
  height: 440px;
  max-height: 440px;
  overflow-y: auto;
  margin: 5;
`;

const LpTokensInput = styled(Form.Control)`
  :focus {
    box-shadow: none !important;
  }
`;

const StyledToggleButton = styled(ToggleButton)`
  border-radius: 0px !important;
  font-size: 12px !important;
`;

const StyledInputSpinner = styled(InputSpinner)`
  input.group-append > input.form-control {
    text-align: center !important;
  }
`;

const StyledRow = styled(Row)`
  border: 1px dashed lightgray;
`;

const LPLock = () => {
  const wallet = useWallet();
  const { t } = useTranslation();
  const { gauges } = useContext(GaugesContext);
  const [selectedGaugeIdx, setSelectedGaugeIdx] = useState(0);
  const [balances, setBalances] = useState([]);
  const [inputLPTokens, setInputLPTokens] = useState();
  const [lockTime, setLockTime] = useState();
  const [lockedStakes, setLockedStakes] = useState([]);
  const [loadingLockedStakes, setLoadingLockedStakes] = useState([]);
  const [showLockedStakes, setShowLockedStakes] = useState(false);
  const [lasTxHash, setLastTxHash] = useState();
  const [locking, setLocking] = useState(false);
  const lpInputRef = useRef();
  const inputRef = useRef();

  const handleLockedStakes = (gauge, stakes) =>
    setLockedStakes(prev => [...prev, { gaugeName: gauge.name, stakes }]);

  const requestLockedStakes = async () => {
    setBalances([]);
    setLockedStakes([]);
    setLoadingLockedStakes(Array.from({ length: gauges.length }, () => false));

    for (let i = 0; i < gauges.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const lpBalance = await getLpTokenBalance(wallet, gauges[i].lpAddress);

      setBalances(prev => [...prev, lpBalance]);

      const arr = [...loadingLockedStakes];
      arr[i] = true;
      setLoadingLockedStakes(arr);

      // eslint-disable-next-line no-await-in-loop
      const stakes = await getLockedStakes(wallet, gauges[i].address);

      arr[i] = false;
      setLoadingLockedStakes(arr);

      handleLockedStakes(gauges[i], stakes);
    }
  };

  const handleOnLpInputChange = async event => {
    const value = Number(event.target.value);

    if (value < balances[selectedGaugeIdx]) setInputLPTokens(value);
    else lpInputRef.current.value = "";
  };

  const lockLpTokens = async () => {
    setLocking(true);

    const hash = await stakeLockedLP(
      wallet,
      inputLPTokens,
      lockTime * 86400,
      gauges[selectedGaugeIdx].lpAddress,
      gauges[selectedGaugeIdx].address
    );

    setLastTxHash(hash);

    await requestLockedStakes();
    setLocking(false);
  };

  useEffect(() => {
    if (gauges && wallet.status === "connected") requestLockedStakes();
    else {
      setBalances([]);
      setLockedStakes([]);
    }
  }, [gauges, wallet.status]);

  console.log(gauges);

  return (
    <StyledCard className="p-2 d-flex flex-column justify-content-center align-items-center">
      <Card.Title>{t("lock_lp_tokens")}</Card.Title>
      <ToggleButtonGroup
        name="group"
        className="mb-3 p-0 mt-2 d-flex flex-row flex-nowrap justify-content-center container w-100"
        value={selectedGaugeIdx}
        onChange={setSelectedGaugeIdx}
        type="radio"
      >
        {gauges
          ? gauges.map((g, index) => (
              // eslint-disable-next-line react/jsx-indent
              <StyledToggleButton
                key={g.name}
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
      <span>
        {t("max_available")} {balances[selectedGaugeIdx] || 0} LP
      </span>
      <LpTokensInput
        ref={lpInputRef}
        disabled={
          balances.length === 0 ||
          balances[selectedGaugeIdx] === 0 ||
          wallet.status === "disconnected"
        }
        max={balances[selectedGaugeIdx]}
        placeholder="0.0"
        className="mb-2 w-75"
        onChange={handleOnLpInputChange}
      />
      <div className="d-flex flex-column justify-content-center align-items-center p-3 w-100">
        <h6 className="text-center">
          {t("lock_duration")} <br /> {t("min_1_day_max_1095_days")}
        </h6>
        <StyledRow className="d-flex flex-row justify-content-center mt-2 shadow-sm rounded p-3">
          <Col
            className="d-flex flex-column justify-content-center"
            xs={12}
            sm={12}
            md={7}
            lg={7}
          >
            <StyledSlider
              disabled={
                balances.length === 0 ||
                balances[selectedGaugeIdx] === 0 ||
                wallet.status === "disconnected"
              }
              value={lockTime}
              onChange={num => {
                setLockTime(num);
                inputRef.current.state.value = num;
              }}
              min={1}
              max={1095}
            />
          </Col>
          <Col
            style={{ minWidth: 100 }}
            xs={12}
            sm={12}
            md={2}
            lg={2}
            className="p-0"
          >
            <StyledInputSpinner
              type="real"
              ref={inputRef}
              value={lockTime}
              precision={0}
              disabled={
                balances.length === 0 ||
                balances[selectedGaugeIdx] === 0 ||
                wallet.status === "disconnected"
              }
              max={1095}
              min={1}
              step={1}
              onChange={num => setLockTime(Number(num))}
              style={{ height: 25 }}
              className="text-right min-w-100 w-100 h-25"
              variant="dark"
              size="sm"
            />
          </Col>
        </StyledRow>
      </div>
      <div className="w-100 d-flex flex-row justify-content-center align-items-center">
        <Button
          disabled={
            balances.length === 0 ||
            balances[selectedGaugeIdx] === 0 ||
            !gauges ||
            !inputLPTokens ||
            inputLPTokens <= 0 ||
            !lockTime
          }
          variant="dark"
          className="text-capitalize font-weight-bold shadow-sm d-flex flex-row justify-content-center align-items-center"
          type="submit"
          size="sm"
          style={{ minWidth: 124 }}
          onClick={lockLpTokens}
        >
          {locking ? (
            <>
              <Spinner animation="grow" className="mr-2" />{" "}
              <span>{t("locking")}</span>
            </>
          ) : (
            <Lock style={{ fontSize: 23 }} />
          )}
        </Button>
        {lasTxHash !== undefined ? (
          <ViewInExplorerBtn hide={setLastTxHash} txHash={lasTxHash} />
        ) : null}
      </div>
      <br />
      <Button
        disabled={
          !lockedStakes ||
          lockedStakes.length === 0 ||
          !lockedStakes[selectedGaugeIdx] ||
          !lockedStakes[selectedGaugeIdx].stakes ||
          lockedStakes[selectedGaugeIdx].stakes.length === 0
        }
        variant="warning"
        className="monospace"
        onClick={() => setShowLockedStakes(true)}
      >
        <strong>
          {loadingLockedStakes &&
          loadingLockedStakes[selectedGaugeIdx] === true ? (
            t("checking_rewards")
          ) : (
            <>
              {t("stakes_and_rewards")} <CashCoin className="ml-2" />
            </>
          )}
        </strong>
      </Button>
      {lockedStakes &&
      lockedStakes.length > 0 &&
      lockedStakes[selectedGaugeIdx] !== undefined &&
      lockedStakes[selectedGaugeIdx].stakes !== undefined ? (
        <LockedStakesList
          show={showLockedStakes}
          setShow={setShowLockedStakes}
          lockedStakes={lockedStakes[selectedGaugeIdx]}
          gaugeIdx={selectedGaugeIdx}
        />
      ) : null}
    </StyledCard>
  );
};

export default memo(LPLock);
