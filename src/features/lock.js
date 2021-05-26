import React, { useState, useEffect, memo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Accordion
} from "react-bootstrap";
import {
  ArrowDownShort,
  QuestionCircle,
  BoxArrowUpRight
} from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useWallet } from "use-wallet";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { maticExplorerUrl } from "../config";
import Layout from "../components/layouts/layout";
import SwapContainer from "../components/ui/swapContainer";
import CardTitle from "../components/ui/cardTitle";
import InfoAlert from "../components/ui/infoAlert";
import {
  lockTokensTx,
  increaseAmount,
  getTokensUserBalanceMaticLocked
} from "../utils/EthDataProvider";
import InfoSwapCard from "../components/ui/infoSwapCard";

const HeaderText = styled.div`
  background-color: #f7f7f9;
`;

const IconWrapper = styled(Button)`
  margin: 15px;
  color: rgb(86, 90, 105);
  text-align: center;
  border: none;
  outline: none;
  font: inherit;
  color: inherit;
  background: none;
`;

const LockValueInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 0.4px dashed lightgray;
  align-items: center;
  margin-bottom: 15px;
`;

const SelectedLockValueText = styled.span`
  font-size: 14px;
  font-weight: normal;
  color: #aeabab;
  margin-bottom: 10px;
  text-transform: capitalize;
`;

const InputLockValue = styled(Form.Control)`
  :focus {
    box-shadow: none !important;
  }
`;

const InputErrorText = styled(Form.Text)`
  color: red;
  font-style: italic;
  font-weight: bold;
`;

const Lock = () => {
  const { t } = useTranslation();
  const methods = useForm({ mode: "onChange" });
  const wallet = useWallet();
  const [txDone, setTxDone] = useState(false);
  const [updatingBalance, setUpdatingBalance] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [lockValue, setLockValue] = useState(0);
  const [currentHiIQ, setCurrentHiIQ] = useState(undefined);
  const [validInput, setValidInput] = useState(true);
  const [filledAmount, setFilledAmount] = useState();
  const [token1] = useState({
    icon: "https://mindswap.finance/tokens/iq.png",
    name: "IQ",
    precision: 3
  });

  const validnum = a => a >= 0 && a <= 1460;

  const handleConfirmation = async result => {
    if (result === "success")
      setCurrentHiIQ(await getTokensUserBalanceMaticLocked(wallet));

    setUpdatingBalance(false);
  };

  const onSubmit = async data => {
    if (!wallet.account) {
      return;
    }

    if (currentHiIQ !== 0)
      await increaseAmount(data.FromAmount, wallet, handleConfirmation);
    else await lockTokensTx(data.FromAmount, String(lockValue), wallet);

    setUpdatingBalance(true);

    setTxDone(true);
  };

  const handleOnInputLockValue = event => {
    const value = Number(event.target.value);

    if (validnum(value)) {
      setLockValue(value);
      setValidInput(true);
    } else {
      setLockValue(0);
      setValidInput(false);
    }
  };

  useEffect(() => setValidInput(validnum(lockValue)), [lockValue]);

  const LockValueJSX = () => (
    <LockValueInfoContainer className="rounded pr-3 pl-3 pt-2 pb-3">
      <div className="d-flex flex-row w-100 justify-content-end">
        <SelectedLockValueText>{t("lock_period")}</SelectedLockValueText>
      </div>
      <Container>
        <Row>
          <Col className="d-flex flex-column justify-content-center" xs={9}>
            <Slider
              disabled={wallet.account === null}
              railStyle={{ backgroundColor: "lightgray", height: 11 }}
              trackStyle={{ height: 14 }}
              handleStyle={{
                borderColor: "black",
                height: 22,
                width: 22
              }}
              onChange={setLockValue}
              className="mb-3"
              value={lockValue}
              min={1}
              max={1460}
              step={1}
            />
          </Col>
          <Col className="p-0">
            <InputLockValue
              disabled={wallet.account === null}
              value={lockValue}
              className="text-center"
              type="number"
              onChange={handleOnInputLockValue}
            />
          </Col>
        </Row>
        {!validInput && (
          <Row>
            <Col className="d-flex flex-column justify-content-center">
              <InputErrorText className="text-center">
                {t("value_restriction")}
              </InputErrorText>
            </Col>
          </Row>
        )}
      </Container>
    </LockValueInfoContainer>
  );

  useEffect(() => {
    if (wallet.status === "connected")
      (async () => {
        setLoadingBalance(true);
        setCurrentHiIQ(await getTokensUserBalanceMaticLocked(wallet));
        setLoadingBalance(false);
      })();
  }, [wallet.status]);

  return (
    <Layout>
      <Container className="p-2 mt-3" fluid>
        <FormProvider {...methods}>
          <Row>
            <Col>
              <CardTitle
                title="IQ Bridge"
                role="img"
                aria-label="lock"
                className="brain"
                icon="🔒"
              />
              <Card className="mx-auto shadow-sm">
                <Card.Body>
                  <Accordion>
                    <div className="d-flex flex-row justify-content-end">
                      {(wallet && wallet.account) ||
                      wallet.status === "connected" ||
                      wallet.status === "connecting" ? (
                        <>
                          {currentHiIQ && currentHiIQ > 0 ? (
                            <div className="mx-auto d-flex flex-row justify-content-center align-items-center  w-75">
                              <Row className="w-100 align-middle">
                                <Col sm={10} md={10} className="p-0">
                                  <h4 className="font-weight-light m-0 text-right">
                                    {!updatingBalance ? (
                                      <>
                                        <strong>
                                          {Number(currentHiIQ).toFixed(2)} hiIQ
                                        </strong>{" "}
                                        {t("locked")}
                                      </>
                                    ) : (
                                      <div className="w-75 d-flex flex-column text-center justify-content-center">
                                        {t("updating_balance")}
                                      </div>
                                    )}
                                  </h4>
                                </Col>
                                <Col sm={2} md={2}>
                                  <Button className="py-0 pl-0" variant="link">
                                    <a
                                      target="_blank"
                                      href={`${maticExplorerUrl}address/${wallet.account}/tokens`}
                                      rel="noreferrer"
                                    >
                                      <BoxArrowUpRight />
                                    </a>
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                          ) : (
                            <div className="w-75 d-flex flex-column justify-content-center">
                              <strong className="text-center text-uppercase">
                                {!loadingBalance &&
                                currentHiIQ &&
                                currentHiIQ === 0
                                  ? t("no_hiiq_tokens_locked")
                                  : t("loading")}
                              </strong>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-75 d-flex flex-column justify-content-center">
                          <strong className="text-center text-uppercase">
                            {t("disconnected")}
                          </strong>
                        </div>
                      )}
                      <Accordion.Toggle
                        as={Button}
                        variant="light"
                        eventKey="0"
                        className="d-flex flex-row justify-content-center align-middle"
                      >
                        <Button variant="light">
                          <QuestionCircle />
                        </Button>
                      </Accordion.Toggle>
                    </div>
                    <Accordion.Collapse eventKey="0">
                      <HeaderText className="shadow-sm rounded p-3 text-justify m-3 highlight">
                        {t("lock_description")}
                      </HeaderText>
                    </Accordion.Collapse>
                  </Accordion>
                  <br />
                  <Form onSubmit={methods.handleSubmit(onSubmit)}>
                    <SwapContainer
                      token={token1}
                      header="From"
                      setFilled={val => setFilledAmount(val)}
                    />
                    <div className="d-flex justify-content-center">
                      <IconWrapper bsPrefix="switch" onClick={() => {}}>
                        <ArrowDownShort />
                      </IconWrapper>
                    </div>
                    <br />
                    {LockValueJSX()}
                    <br />
                    <Button
                      disabled={
                        !wallet.account || lockValue === 0 || !filledAmount
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

              {lockValue !== 0 && filledAmount && (
                <InfoSwapCard
                  tokensLocked={Number(filledAmount)}
                  timeLocked={Number(lockValue)}
                />
              )}
            </Col>
          </Row>
          {wallet.account && txDone && (
            <Row>
              <Col>
                <InfoAlert text="Tx executed" />
              </Col>
            </Row>
          )}
          {!wallet.account && (
            <Row>
              <Col>
                <InfoAlert text={t("login_info_matic")} />
              </Col>
            </Row>
          )}
        </FormProvider>
      </Container>
    </Layout>
  );
};

export default memo(Lock);
