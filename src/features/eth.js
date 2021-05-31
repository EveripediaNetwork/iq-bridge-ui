import React, { useState, memo, useContext, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { ArrowDownShort } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useWallet } from "use-wallet";

import Layout from "../components/layouts/layout";
import SwapContainer from "../components/ui/swapContainer";
import CardTitle from "../components/ui/cardTitle";
import InfoAlert from "../components/ui/infoAlert";
import { convertPTokensTx } from "../utils/EthDataProvider/EthDataProvider";
import { ChainIdContext } from "../context/chainIdProvider/chainIdContext";
import { ethChainId, maticChainId } from "../config";

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

const Eth = () => {
  const { t } = useTranslation();
  const { currentChainId, setCurrentChainId } = useContext(ChainIdContext);
  const methods = useForm({ mode: "onChange" });
  const wallet = useWallet();
  const [txDone, setTxDone] = useState(false);
  const [token1, setToken1] = useState({
    icon: "https://mindswap.finance/tokens/iq.png",
    name: "pIQ",
    precision: 3
  });

  const onSubmit = async data => {
    if (!wallet.account) {
      return;
    }

    await convertPTokensTx(data.FromAmount, wallet);

    setTxDone(true);
  };

  useEffect(() => {
    if (currentChainId === maticChainId || !currentChainId) {
      wallet.reset();
      setCurrentChainId(ethChainId);
    }
  }, [currentChainId]);

  return (
    <Layout>
      <Container className="p-2 mt-3" fluid>
        <FormProvider {...methods}>
          <Row>
            <Col>
              <CardTitle
                title="IQ Bridge"
                role="img"
                aria-label="brain"
                className="brain"
                icon="🌉"
              />
              <Card className="mx-auto shadow-sm">
                <Card.Body>
                  <Form onSubmit={methods.handleSubmit(onSubmit)}>
                    {currentChainId === ethChainId && (
                      <SwapContainer
                        token={token1}
                        setToken={setToken1}
                        header="From"
                      />
                    )}
                    <div className="d-flex justify-content-center">
                      <IconWrapper bsPrefix="switch" onClick={() => {}}>
                        <ArrowDownShort />
                      </IconWrapper>
                    </div>
                    <br />
                    <Button
                      disabled={!wallet.account}
                      variant="primary"
                      className="text-capitalize"
                      type="submit"
                      size="lg"
                      block
                    >
                      {t("Swap to IQ ERC20")}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
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
                <InfoAlert text={t("login_info_eth")} />
              </Col>
            </Row>
          )}
        </FormProvider>
      </Container>
    </Layout>
  );
};

export default memo(Eth);
