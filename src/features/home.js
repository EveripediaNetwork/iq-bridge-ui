import React, { useContext, useState, memo, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { ArrowDownShort } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useWallet } from "use-wallet";

import { WallerProviderContext as UALContext } from "../context/walletProvider/walletProviderFacade";
import Layout from "../components/layouts/layout";
import WrongChainModal from "../components/ui/wrongChainModal";
import SwapContainer from "../components/ui/swapContainer";
import CardTitle from "../components/ui/cardTitle";
import InfoAlert from "../components/ui/infoAlert";
import AddressContainer from "../components/ui/addressContainer";
import { convertTokensTx } from "../utils/EosDataProvider";
import TxSuccessAlert from "../components/ui/txSuccessAlert";

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

const Home = () => {
  const { t } = useTranslation();
  const methods = useForm({ mode: "onChange" });
  const wallet = useWallet();
  const authContext = useContext(UALContext);
  const [filled, setFilled] = useState();
  const [openWrongChainModal, setOpenWrongChainModal] = useState(false);
  const [txData, setTxData] = useState("");
  const [token1, setToken1] = useState({
    icon: "https://mindswap.finance/tokens/iq.png",
    name: "IQ",
    precision: 3,
    chain: "EOS"
  });

  const onSubmit = async data => {
    if (!authContext.activeUser) return;

    const result = await convertTokensTx(
      `${parseFloat(data.FromAmount).toFixed(3)} ${data.FromToken}`,
      data.address,
      authContext
    );
    setTxData(result.transactionId);
  };

  useEffect(() => {
    if (wallet.status === "error" && wallet.account === null)
      setOpenWrongChainModal(true);
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
                aria-label="brain"
                className="brain"
                icon="🌉"
              />
              <Card className="mx-auto shadow-sm">
                <Card.Body>
                  <Form onSubmit={methods.handleSubmit(onSubmit)}>
                    <SwapContainer
                      token={token1}
                      setToken={setToken1}
                      setFilled={setFilled}
                      header="From"
                    />
                    <div className="d-flex justify-content-center">
                      <IconWrapper bsPrefix="switch">
                        <ArrowDownShort />
                      </IconWrapper>
                    </div>
                    <AddressContainer />
                    <br />
                    <Button
                      disabled={!authContext.activeUser || !filled}
                      variant="primary"
                      className="text-capitalize"
                      type="submit"
                      size="lg"
                      block
                    >
                      {t("swap")}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {authContext.activeUser && txData !== "" && (
            <Row>
              <Col>
                <TxSuccessAlert txId={txData} />
              </Col>
            </Row>
          )}
          {!authContext.activeUser && (
            <Row>
              <Col>
                <InfoAlert text={t("login_info_eos")} />
              </Col>
            </Row>
          )}
        </FormProvider>
      </Container>
      <WrongChainModal
        show={openWrongChainModal}
        onHide={() => setOpenWrongChainModal(false)}
      />
    </Layout>
  );
};

export default memo(Home);
