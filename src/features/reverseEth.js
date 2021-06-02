import React, { memo, useContext, useEffect, useState } from "react";
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
import { reverseIQtoEOSTx } from "../utils/EthDataProvider/EthDataProvider";
import { ChainIdContext } from "../context/chainIdProvider/chainIdContext";
import { ethChainId } from "../config";
import AddressContainer from "../components/ui/addressContainer";
import TxSuccessAlert from "../components/ui/txSuccessAlert";

// TODO: this is 3-4 times already, time to extract
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

const ReverseEth = () => {
  const { t } = useTranslation();
  const { currentChainId, setCurrentChainId } = useContext(ChainIdContext);
  const methods = useForm({ mode: "onChange" });
  const wallet = useWallet();
  const [txData, setTxData] = useState("");
  const [token1, setToken1] = useState({
    icon: "https://mindswap.finance/tokens/iq.png",
    name: "IQ",
    precision: 3,
    chain: "Ethereum"
  });

  const onSubmit = async data => {
    if (!wallet.account) {
      return;
    }
    const result = await reverseIQtoEOSTx(
      data.FromAmount,
      wallet,
      data.address
    );
    setTxData(result.transactionId);
  };

  useEffect(() => {
    if (!currentChainId) {
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
                    <AddressContainer
                      title="your_eos_address"
                      placeholder="eos_account"
                    />
                    <br />
                    <Button
                      disabled={!wallet.account}
                      variant="primary"
                      className="text-capitalize"
                      type="submit"
                      size="lg"
                      block
                    >
                      {t("Swap IQ to EOS")}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {wallet.account && txData !== "" && (
            <Row>
              <Col>
                <TxSuccessAlert txId={txData} />
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

export default memo(ReverseEth);
