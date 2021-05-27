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
  lockTokensTx,
  increaseAmount,
  getTokensUserBalanceMaticLocked
} from "../../utils/EthDataProvider";
import InfoSwapCard from "../../components/ui/infoSwapCard";

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

const Lock = () => {
  const { t } = useTranslation();
  const methods = useForm({ mode: "onChange" });
  const wallet = useWallet();
  const [txDone, setTxDone] = useState(false);
  const [updatingBalance, setUpdatingBalance] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [lockValue, setLockValue] = useState(0);
  const [currentHiIQ, setCurrentHiIQ] = useState(undefined);
  const [filledAmount, setFilledAmount] = useState();
  const [token1] = useState({
    icon: "https://mindswap.finance/tokens/iq.png",
    name: "IQ",
    precision: 3
  });

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
                      <LockHeader
                        wallet={wallet}
                        currentHiIQ={currentHiIQ}
                        updatingBalance={updatingBalance}
                        loadingBalance={loadingBalance}
                      />
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
                    <LockPeriod
                      wallet={wallet}
                      updateParentLockValue={setLockValue}
                    />
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
