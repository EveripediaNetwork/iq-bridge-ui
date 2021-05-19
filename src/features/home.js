import React, { useContext, useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { ArrowDownShort } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

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
  font-size: 14px;
  font-weight: normal;
  color: #aeabab;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const MainCard = styled(Card)``;

const InputLockValue = styled(Form.Control)`
  /* border: 0px !important; */

  :focus {
    box-shadow: none !important;
  }
`;

const InputErrorText = styled(Form.Text)`
  color: red;
  font-style: italic;
  font-weight: bold;
`;

const Home = () => {
  const { t } = useTranslation();
  const methods = useForm({ mode: "onChange" });
  const authContext = useContext(UALContext);
  const [txData, setTxData] = useState("");
  const [lockValue, setLockValue] = useState(0);
  const [validInput, setValidInput] = useState(true);
  const [token1, setToken1] = React.useState({
    icon: "https://mindswap.finance/tokens/iq.png",
    name: "IQ",
    precision: 3,
  });

  const onSubmit = async (data) => {
    if (!authContext.activeUser) return;

    const result = await convertTokensTx(
      `${parseFloat(data.FromAmount).toFixed(3)} ${data.FromToken}`,
      data.address,
      authContext
    );
    setTxData(result.transactionId);
  };

  const handleOnInputLockValue = (event) => {
    const value = Number(event.target.value);

    if (validnum(value)) {
      setLockValue(value);
      setValidInput(true);
    } else {
      setLockValue(0);
      setValidInput(false);
    }
  };

  const validnum = (a) => a >= 0 && a <= 1460;

  const LockValueJSX = () => (
    <LockValueInfoContainer className="rounded pr-3 pl-3 pt-2 pb-3">
      <div className="d-flex flex-row w-100 justify-content-end">
        <SelectedLockValueText>{t("lock_period")}</SelectedLockValueText>
      </div>
      <Container>
        <Row>
          <Col className="d-flex flex-column justify-content-center" xs={9}>
            <Slider
              railStyle={{ backgroundColor: "lightgray", height: 11 }}
              trackStyle={{ height: 14 }}
              handleStyle={{
                borderColor: "black",
                height: 22,
                width: 22,
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

  useEffect(() => setValidInput(validnum(lockValue)), [lockValue]);

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
                    {LockValueJSX()}
                    <br />
                    <Button
                      disabled={!authContext.activeUser}
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
