import React, { useState, memo, useContext, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { ArrowDownShort } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useWallet } from "use-wallet";
import detectEthereumProvider from "@metamask/detect-provider";

import Layout from "../components/layouts/layout";
import SwapContainer from "../components/ui/swapContainer";
import CardTitle from "../components/ui/cardTitle";
import InfoAlert from "../components/ui/infoAlert";
import { convertPTokensTx } from "../utils/EthDataProvider/EthDataProvider";
import { TransactionContext } from "../context/transactionContext";
import useTitle from "../hooks/useTitle";
import { iqAddress } from "../config";

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
  useTitle("Bridge");
  const methods = useForm({ mode: "onChange" });
  const wallet = useWallet();
  const { setHashes, setTxDone } = useContext(TransactionContext);
  const [detectedProvider, setDetectedProvider] = useState();

  const [token1, setToken1] = useState({
    icon: `${window.location.origin}/tokens/iq.png`,
    name: "pIQ",
    precision: 3,
    chain: "Ethereum"
  });

  const onSubmit = async data => {
    if (!wallet.account) {
      return;
    }

    setHashes(await convertPTokensTx(data.FromAmount, wallet));

    setTxDone(true);
  };

  const handleAddIQERC20TokenToMetamask = async () => {
    detectedProvider.sendAsync(
      {
        method: "metamask_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: iqAddress,
            symbol: "IQ",
            decimals: 18,
            image:
              "https://pbs.twimg.com/profile_images/1414736076158033921/nResATsF_400x400.png"
          }
        },
        id: Math.round(Math.random() * 100000)
      },
      (err, added) => {
        console.log("provider returned", err, added);
        if (err || "error" in added) {
          console.log(err);
        }
      }
    );
  };

  useEffect(() => {
    const getDetectedProvider = async () => {
      const provider = await detectEthereumProvider();
      setDetectedProvider(provider);
    };
    getDetectedProvider();
  }, []);

  return (
    <Layout>
      <Container className="mt-3" fluid>
        <FormProvider {...methods}>
          <Row>
            <Col>
              <CardTitle title="IQ Bridge" aria-label="brain" icon="🌉" />
              <Card className="mx-auto shadow-sm">
                <Card.Body>
                  <Form onSubmit={methods.handleSubmit(onSubmit)}>
                    <SwapContainer
                      token={token1}
                      setToken={setToken1}
                      header={t("from")}
                    />
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
                      {t("swap_to_iq_erc20")}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {!wallet.account && (
            <Row>
              <Col>
                <InfoAlert text={t("login_info_eth")} />
              </Col>
            </Row>
          )}
        </FormProvider>
        <div className="text-center">
          <Button
            variant="outline-primary"
            className="btn-sm"
            onClick={handleAddIQERC20TokenToMetamask}
          >
            {t("add_token")}
          </Button>
        </div>
      </Container>
    </Layout>
  );
};

export default memo(Eth);
