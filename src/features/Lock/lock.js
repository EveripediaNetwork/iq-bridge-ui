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
import { ArrowDownShort, QuestionCircle } from "react-bootstrap-icons";
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
  increaseAmount,
  increaseUnlockTime,
  getMaximumLockableTime,
  withdraw,
  getLockedEnd,
  lockTokensTx
} from "../../utils/EthDataProvider/EthDataProvider";
import InfoSwapCard from "../../components/ui/infoSwapCard";
import { TransactionContext } from "../../context/transactionContext";

const LockStats = lazy(() => import("./lockStats"));

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

const Lock = () => {
  const { t } = useTranslation();
  const methods = useForm({ mode: "onChange" });
  const wallet = useWallet();
  const { hashes, setHashes, setTxDone } = useContext(TransactionContext);
  const [updatingBalance, setUpdatingBalance] = useState(false);
  const [loadBalance, setLoadBalance] = useState(true);
  const [balance, setBalance] = useState();
  const [lockValue, setLockValue] = useState();
  const [lockedTimeDiff, setLockedTimeDiff] = useState();
  const [currentHiIQ, setCurrentHiIQ] = useState(undefined);
  const [filledAmount, setFilledAmount] = useState();
  const [lockEnd, setLockEnd] = useState();
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

    // setLoadBalance(false);
    setUpdatingBalance(true);

    if (currentHiIQ !== 0) {
      if (radioValue === 1)
        setHashes([
          ...hashes,
          ...(await increaseAmount(data.FromAmount, wallet, handleConfirmation))
        ]);

      if (radioValue === 2)
        await increaseUnlockTime(wallet, lockEnd.getTime(), handleConfirmation);
    } else {
      setHashes(
        await lockTokensTx(
          data.FromAmount,
          lockValue,
          wallet,
          handleConfirmation
        )
      );
      setLoadBalance(true);
    }

    setTxDone(true);

    resetValues();
  };

  const handleSetLockValue = lv => {
    if (lv === 0) {
      setLockValue(0);
      return;
    }

    const temp = lockEnd || new Date();

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

  useEffect(() => {
    if (currentHiIQ && currentHiIQ > 0)
      (async () => {
        const result = await getLockedEnd(wallet);

        setLockEnd(result);
        setMaximumLockableTime(
          (await getMaximumLockableTime(wallet, result)) - 1
        );
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
        // setLoadingBalance(false);
        setLoadBalance(false);
        setUpdatingBalance(false);
      })();
  }, [wallet.status, loadBalance]);

  return (
    <Layout>
      <Container
        className="p-2 mt-3 d-flex flex-row justify-content-center flex-wrap"
        fluid
      >
        <CardDivContainer className="d-flex flex-row flex-wrap align-items-center">
          {wallet.account && currentHiIQ && (
            <LockStats wallet={wallet} hiIQBalance={currentHiIQ} />
          )}
          <FormProvider {...methods}>
            <Col>
              <CardTitle title="IQ Bridge" aria-label="lock" icon="🔒" />
              <Card className="mx-auto shadow-sm">
                <Card.Body>
                  <Accordion>
                    <div className="d-flex flex-row justify-content-end">
                      {currentHiIQ !== undefined && (
                        <LockHeader
                          wallet={wallet}
                          currentHiIQ={currentHiIQ}
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
                      </HeaderText>
                    </Accordion.Collapse>
                  </Accordion>
                  <br />
                  <>
                    {currentHiIQ > 0 && expired === true && (
                      <div className="text-center p-3">
                        <Button
                          onClick={handleWithdraw}
                          size="md"
                          variant="outline-success"
                        >
                          {t("withdraw")}
                        </Button>
                      </div>
                    )}
                  </>
                  {lockEnd && expired !== undefined && (
                    <>
                      <Alert
                        className="text-center mb-0 w-75 mt-0 p-0 container"
                        variant={expired ? "danger" : "light"}
                      >
                        {expired ? (
                          t("expired")
                        ) : (
                          <>
                            {`${t("expiring_on")} `}
                            <strong>{`${lockEnd.toDateString()}`}</strong>
                          </>
                        )}
                        <br />
                      </Alert>
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
                            Increase amount
                          </StyledToggleButton>
                          <StyledToggleButton
                            size="sm"
                            name="time"
                            variant="outline-info"
                            value={2}
                          >
                            Increase Lock Time
                          </StyledToggleButton>
                        </ToggleButtonGroup>
                      )}
                    </>
                  )}
                  <Form onSubmit={methods.handleSubmit(onSubmit)}>
                    <SwapContainer
                      radioValue={radioValue}
                      token={token1}
                      header={t("from")}
                      setParentBalance={setBalance}
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
                      updateParentLockValue={handleSetLockValue}
                      radioValue={radioValue}
                      currentHIIQ={currentHiIQ}
                      maximumLockableTime={maximumLockableTime - 1}
                    />
                    <br />
                    <Button
                      disabled={
                        !wallet.account ||
                        (!balance && radioValue === 1) ||
                        (balance === 0 && radioValue === 1) ||
                        (!filledAmount &&
                          currentHiIQ !== 0 &&
                          radioValue === 1) ||
                        (currentHiIQ === 0 && !lockValue) ||
                        (!lockValue && radioValue === 2) ||
                        (currentHiIQ === 0 &&
                          radioValue === 2 &&
                          lockValue === 0) ||
                        (currentHiIQ === 0 &&
                          radioValue === 1 &&
                          !filledAmount) ||
                        (currentHiIQ === 0 && balance === 0) ||
                        (currentHiIQ === 0 && !filledAmount)
                      }
                      variant="primary"
                      className="text-capitalize"
                      type="submit"
                      size="lg"
                      block
                    >
                      {t("lock")}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>

              {lockValue &&
              lockValue !== 0 &&
              filledAmount &&
              balance &&
              balance !== 0 ? (
                <InfoSwapCard
                  tokensLocked={Number(filledAmount)}
                  timeLocked={
                    currentHiIQ && lockEnd > 0
                      ? Number(lockedTimeDiff)
                      : Number(lockValue)
                  }
                />
              ) : null}

              {lockValue && lockValue !== 0 && radioValue === 2 ? (
                <InfoSwapCard
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
