import React, { useContext, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { ArrowDownShort } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { WallerProviderContext as UALContext } from "../context/walletProvider/walletProviderFacade";
import Layout from "../components/layouts/layout";
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

const LockValueInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 0.4px dashed lightgray;
  align-items: center;
  margin-bottom: 15px;
`;

const SelectedLockValueText = styled.span`
  text-align: center;
  font-size: 24px;
  font-weight: normal;
  margin-bottom: 10px
`;

const MainCard = styled(Card)``;

const InputLockValue = styled(Form.Control)`
  /* border: 0px !important; */
  
  :focus {
    box-shadow: none !important;
  }
`;

const Home = () => {
  const { t } = useTranslation();
  const methods = useForm({ mode: "onChange" });
  const authContext = useContext(UALContext);
  const [txData, setTxData] = useState('');
  const [lockValue, setLockValue] = useState(0)
  const [token1, setToken1] = React.useState({
    icon: "https://mindswap.finance/tokens/iq.png",
    name: "IQ",
    precision: 3,
  });

  const onSubmit = async (data) => {
    if (!authContext.activeUser) {
      return;
    }
    const result = await convertTokensTx(
      `${parseFloat(data.FromAmount).toFixed(3)} ${data.FromToken}`,
      data.address,
      authContext
    );
    setTxData(result.transactionId);
  };

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
              <MainCard className="mx-auto shadow-sm">
                <Card.Body>
                  <Form onSubmit={methods.handleSubmit(onSubmit)}>
                    <SwapContainer
                      token={token1}
                      setToken={setToken1}
                      header="From"
                    />
                    <div className="d-flex justify-content-center">
                      <IconWrapper bsPrefix="switch" onClick={() => {}}>
                        <ArrowDownShort />
                      </IconWrapper>
                    </div>
                    <AddressContainer />
                    <br />
                    <LockValueInfoContainer className="rounded shadow-sm pr-3 pl-3 pt-4 pb-4">
                      <SelectedLockValueText>
                        {lockValue === 0 ? (
                          <>
                            {t("select_lock_value")}
                          </>
                        ): (
                          <>
                            {t("selected_lock_value")}: {lockValue}
                          </>
                        )}
                      </SelectedLockValueText>
                      <Container>
                        <Row>
                          <Col className="d-flex flex-column justify-content-center" xs={9}>
                            <Slider
                              railStyle={{ backgroundColor: 'lightgray', height: 11 }}
                              trackStyle={{ height: 14 }}
                              handleStyle={{
                                borderColor: 'black',
                                height: 22,
                                width: 22,
                              }}
                              onChange={setLockValue} 
                              min={1} 
                              max={30} 
                              step={1} 
                            />
                          </Col>
                          <Col className="p-0">
                            <InputLockValue type="number"/>
                          </Col>
                        </Row>
                      </Container>
                    </LockValueInfoContainer>
                    <Button
                      disabled={!authContext.activeUser}
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
              </MainCard>
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
                <InfoAlert text={t("login_info")} />
              </Col>
            </Row>
          )}
        </FormProvider>
      </Container>
    </Layout>
  );
};

export default React.memo(Home);
