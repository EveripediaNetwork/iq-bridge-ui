import React, { memo, useContext, useEffect, useState, lazy } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import {
  Accordion,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Alert,
  ToggleButtonGroup,
  ToggleButton
} from "react-bootstrap";
import {
  ArrowDownShort,
  QuestionCircle,
  JournalText
} from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useWallet } from "use-wallet";

import LockPeriod from "./lockPeriod";
import LockHeader from "./lockHeader";
import Layout from "../../components/layouts/layout";
import SwapContainer from "../../components/ui/swapContainer";
import CardTitle from "../../components/ui/cardTitle";
import InfoAlert from "../../components/ui/infoAlert";
import {
  getTokensUserBalanceLocked,
  getIQLockedByTheUser,
  increaseAmount,
  increaseUnlockTime,
  getMaximumLockableTime,
  withdraw,
  getLockedEnd,
  lockTokensTx,
  callCheckpoint
} from "../../utils/EthDataProvider/EthDataProvider";
import InfoSwapCard from "../../components/ui/infoSwapCard";
import { TransactionContext } from "../../context/transactionContext";

import { ethBasedExplorerUrl, hiIQAddress } from "../../config";
import useTitle from "../../hooks/useTitle";

const Stats = lazy(() => import("./stats"));
const HeaderText = styled.div`
  background-color: #f7f7f9;
`;

const CardDivContainer = styled.div`
  min-width: 50%;
`;

const IconWrapper = styled(Button)`
  height: 30px;
  max-height: 30px;
  color: rgb(86, 90, 105);
  text-align: center;
  border: none;
  outline: none;
  font: inherit;
  color: inherit;
  background: none;
`;

const StyledToggleButton = styled(ToggleButton)`
  min-width: 135px;
`;

const StyledDescriptionDiv = styled.div`
  border: 1px dashed gray;
  border-radius: 5px;
  max-width: fit-content;
  margin: auto;
  padding: 7px;
  border-color: #388afc;
`;

const StyledSpan = styled.span`
  letter-spacing: -0.5px;
  font-size: 14px;
`;

const StyledAlert = styled(Alert)`
  height: 30px;
  border-radius: 5px !important;
`;

const IQIcon = styled.img`
  width: 20px;

  @media (max-width: 768px) {
    width: 15px;
  }
`;
const Lock = () => {
  const { t } = useTranslation();
  useTitle("Lock");
  const methods = useForm({ mode: "onChange" });
  const wallet = useWallet();
  const { hashes, setHashes } = useContext(TransactionContext);
  const [updatingBalance, setUpdatingBalance] = useState(false);
  const [loadBalance, setLoadBalance] = useState(true);
  const [balance, setBalance] = useState();
  const [lockValue, setLockValue] = useState();
  const [lockedTimeDiff, setLockedTimeDiff] = useState();
  const [currentHiIQ, setCurrentHiIQ] = useState(undefined);
  const [lockedIQ, setLockedIQ] = useState(undefined);
  const [filledAmount, setFilledAmount] = useState();
  const [lockEnd, setLockEnd] = useState();
  const [diffDays, setDiffDays] = useState();
  const [maximumLockableTime, setMaximumLockableTime] = useState();
  const [expired, setExpired] = useState();
  const [radioValue, setRadioValue] = useState(1);
  const [token1] = useState({
    icon: `${window.location.origin}/tokens/iq.png`,
    name: "IQ",
    precision: 3,
    chain: "Ethereum"
  });

  const handleConfirmation = async result => {
    if (result === "success") {
      setLoadBalance(true);
    }
  };

  const resetValues = () => {
    setFilledAmount();
    setLockValue();
  };

  const onSubmit = async data => {
    if (!wallet.account) return;

    setUpdatingBalance(true);

    if (currentHiIQ !== 0) {
      if (radioValue === 1) {
        const increaseAmountResult = await increaseAmount(
          data.FromAmount,
          wallet,
          handleConfirmation
        );

        await increaseAmountResult.result.wait();

        setHashes([...hashes, ...increaseAmountResult.hashes]);
      }

      if (radioValue === 2) {
        const increaseUnlockTimeResult = await increaseUnlockTime(
          wallet,
          lockEnd.getTime(),
          handleConfirmation
        );
        await increaseUnlockTimeResult.result.wait();
      }
    } else {
      const lockTokensResult = await lockTokensTx(
        data.FromAmount,
        lockValue,
        wallet,
        handleConfirmation
      );
      setHashes(...lockTokensResult.hashes);

      await lockTokensResult.result.wait();
      setLoadBalance(true);
    }

    await callCheckpoint(wallet);

    resetValues();
  };

  const handleSetLockValue = lv => {
    const temp = lockEnd || new Date();
    if (lv === 0) {
      setLockValue(0);
      temp.setDate(temp.getDate() - 7);
      setLockEnd(temp);
      return;
    }

    if (!lockValue) temp.setDate(temp.getDate() + lv);
    else {
      if (lv < lockValue) temp.setDate(temp.getDate() - (lockValue - lv));

      if (lv > lockValue) temp.setDate(temp.getDate() + (lv - lockValue));
    }

    setLockEnd(temp);
    setLockValue(lv);
  };

  const handleWithdraw = () => {
    (async () => {
      const result = await withdraw(wallet);
      if (result) {
        await result.wait();
        setLoadBalance(true);
      }
    })();
  };

  const handleRadioChange = val => {
    setRadioValue(val);
    resetValues();
  };

  const calculateDatesDiff = (date1, date2) => {
    const diffInMs = date1 - date2;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays.toFixed(0) - 1;
  };

  const buttonIsDisabled = () => {
    return (
      !wallet.account ||
      wallet.account === null ||
      wallet.status === "disconnected" ||
      (!balance && radioValue === 1) ||
      (balance === 0 && radioValue === 1) ||
      ((!filledAmount || filledAmount === 0) &&
        currentHiIQ !== 0 &&
        radioValue === 1) ||
      (!lockValue && radioValue === 2) ||
      (currentHiIQ === 0 && !lockValue) ||
      (currentHiIQ === 0 && radioValue === 2 && lockValue === 0) ||
      (currentHiIQ === 0 && radioValue === 1 && !filledAmount) ||
      (currentHiIQ === 0 && balance === 0) ||
      (currentHiIQ === 0 && !filledAmount)
    );
  };

  useEffect(() => {
    if (currentHiIQ && currentHiIQ > 0)
      (async () => {
        const result = await getLockedEnd(wallet);

        setLockEnd(result);

        const maximumLockableTimeResult = await getMaximumLockableTime(
          wallet,
          result
        );

        setMaximumLockableTime(maximumLockableTimeResult);
        setLockedTimeDiff(calculateDatesDiff(result, new Date()));
        setExpired(new Date().getTime() > result.getTime());
      })();
  }, [currentHiIQ]);

  useEffect(() => {
    if (loadBalance === false) return;

    setUpdatingBalance(true);

    if (wallet.status === "connected" && wallet.ethereum)
      (async () => {
        setCurrentHiIQ(Number(await getTokensUserBalanceLocked(wallet)));
        setLockedIQ(await getIQLockedByTheUser(wallet));
        setLoadBalance(false);
        setUpdatingBalance(false);
      })();
  }, [wallet.status, loadBalance]);

  useEffect(() => {
    if (filledAmount && lockEnd && currentHiIQ && currentHiIQ > 0) {
      const days = Number(
        (lockEnd.getTime() - new Date().getTime()) / (1000 * 3600 * 24)
      ).toFixed();
      setDiffDays(days);
    }
  }, [filledAmount, lockEnd, currentHiIQ]);

  return (
    <Layout>
      <Container
        className="p-2 mt-3 d-flex flex-row justify-content-center flex-wrap"
        fluid
      >
        <CardDivContainer className="d-flex flex-row flex-wrap-reverse align-items-center">
          <Stats
            wallet={wallet}
            lockedAlready={currentHiIQ && currentHiIQ !== 0}
          />
          <FormProvider {...methods}>
            <Col className="mb-3">
              <CardTitle title="HiIQ Lock" aria-label="lock" icon="🔒" />
              <Card className="mx-auto shadow-sm">
                <Card.Body>
                  <Accordion>
                    <div className="d-flex flex-row justify-content-center align-items-center">
                      {currentHiIQ !== undefined && lockedIQ !== undefined && (
                        <LockHeader
                          wallet={wallet}
                          currentHiIQ={currentHiIQ}
                          lockedIQ={lockedIQ}
                          updatingBalance={updatingBalance}
                        />
                      )}
                      <Accordion.Toggle
                        as={Button}
                        variant="light"
                        eventKey="0"
                        className="d-flex flex-row justify-content-center align-middle"
                      >
                        <div variant="light">
                          <QuestionCircle />
                        </div>
                      </Accordion.Toggle>
                    </div>
                    <Accordion.Collapse eventKey="0">
                      <HeaderText className="shadow-sm rounded p-3 text-justify m-3 highlight">
                        {t("lock_description")}
                        <StyledDescriptionDiv className="shadow-sm mt-3 d-flex flex-column align-items-start">
                          <StyledSpan>
                            <IQIcon src={token1.icon} /> <strong>1 IQ</strong>{" "}
                            {t("locked_for_4_years")} ≈{" "}
                            <strong>3.99 HiIQ</strong>
                          </StyledSpan>
                          <StyledSpan>
                            <IQIcon src={token1.icon} /> <strong>1 IQ</strong>{" "}
                            {t("locked_for_3_years")} ≈{" "}
                            <strong>3.24 HiIQ</strong>
                          </StyledSpan>
                          <StyledSpan>
                            <IQIcon src={token1.icon} /> <strong>1 IQ</strong>{" "}
                            {t("locked_for_2_years")} ≈{" "}
                            <strong>2.50 HiIQ</strong>
                          </StyledSpan>
                          <StyledSpan>
                            <IQIcon src={token1.icon} /> <strong>1 IQ</strong>{" "}
                            {t("locked_for_1_year")} ≈{" "}
                            <strong>1.75 HiIQ</strong>
                          </StyledSpan>
                        </StyledDescriptionDiv>
                      </HeaderText>
                    </Accordion.Collapse>
                  </Accordion>
                  <br />
                  {currentHiIQ > 0 && (
                    <ToggleButtonGroup
                      name="group"
                      className="mb-3 mt-2 d-flex flex-row flex-wrap justify-content-center container w-75"
                      value={radioValue}
                      onChange={handleRadioChange}
                      type="radio"
                    >
                      <StyledToggleButton
                        size="sm"
                        name="amount"
                        variant="outline-info"
                        value={1}
                      >
                        {t("increase_amount")}
                      </StyledToggleButton>
                      <StyledToggleButton
                        size="sm"
                        name="time"
                        variant="outline-info"
                        value={2}
                      >
                        {t("increase_lock_time")}
                      </StyledToggleButton>
                    </ToggleButtonGroup>
                  )}
                  {lockEnd && expired !== undefined && expired === false && (
                    <>
                      <StyledAlert
                        className="text-center mb-4 w-75 mt-0 p-0 container"
                        variant="light"
                      >
                        <>
                          {`${t("expiring_on")} `}
                          <strong>{`${lockEnd.toDateString()}`}</strong>
                        </>
                      </StyledAlert>
                    </>
                  )}
                  <Form onSubmit={methods.handleSubmit(onSubmit)}>
                    <SwapContainer
                      radioValue={radioValue}
                      token={token1}
                      header={t("from")}
                      setParentBalance={b => {
                        setBalance(b);
                      }}
                      setFilled={setFilledAmount}
                    />
                    <div className="d-flex justify-content-center">
                      <IconWrapper bsPrefix="switch" onClick={() => {}}>
                        <ArrowDownShort />
                      </IconWrapper>
                    </div>
                    <br />
                    <LockPeriod
                      wallet={wallet}
                      updateParentLockValue={lv => handleSetLockValue(lv)}
                      radioValue={radioValue}
                      filledAmount={Number(filledAmount).toFixed(2)}
                      currentHIIQ={currentHiIQ}
                      maximumLockableTime={maximumLockableTime}
                    />
                    <br />
                    <div className="container d-flex flex-row justify-content-center align-items-center">
                      {expired && expired === true ? (
                        <Button
                          onClick={handleWithdraw}
                          type="submit"
                          className="text-capitalize w-75"
                          size="lg"
                          variant="outline-success"
                        >
                          {t("withdraw")} expired tokens
                        </Button>
                      ) : (
                        <Button
                          disabled={buttonIsDisabled()}
                          variant="outline-dark"
                          className="text-capitalize w-75 font-weight-bold"
                          type="submit"
                          size="lg"
                        >
                          {t("lock")}
                        </Button>
                      )}

                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dark ml-2"
                        href={`${ethBasedExplorerUrl}address/${hiIQAddress}`}
                      >
                        <JournalText size="20px" />
                      </a>
                    </div>
                  </Form>
                </Card.Body>
              </Card>

              {lockValue &&
              lockValue !== 0 &&
              filledAmount &&
              balance &&
              balance !== 0 ? (
                <InfoSwapCard
                  timeLockedDescription={t("time_locked")}
                  balanceDescription={t("new_hiiq_balance")}
                  tokensLocked={Number(filledAmount)}
                  timeLocked={
                    currentHiIQ && lockEnd > 0
                      ? Number(lockedTimeDiff)
                      : Number(lockValue)
                  }
                />
              ) : null}

              {lockEnd &&
              filledAmount &&
              Number(filledAmount) > 0 &&
              diffDays &&
              lockedIQ ? (
                <InfoSwapCard
                  timeLockedDescription="Current unlock time (days)"
                  balanceDescription="Expected hiIQ (includes current)"
                  tokensLocked={Number(lockedIQ) + Number(filledAmount)}
                  timeLocked={Number(diffDays)}
                />
              ) : null}

              {lockValue && lockValue !== 0 && radioValue === 2 ? (
                <InfoSwapCard
                  timeLockedDescription={t("time_locked")}
                  balanceDescription={t("new_hiiq_balance")}
                  tokensLocked={Number(currentHiIQ)}
                  timeLocked={Number(lockValue)}
                />
              ) : null}
              {!wallet.account && (
                <Row>
                  <Col>
                    <InfoAlert text={t("login_info_eth_locking")} />
                  </Col>
                </Row>
              )}
            </Col>
          </FormProvider>
        </CardDivContainer>
      </Container>
    </Layout>
  );
};

export default memo(Lock);
