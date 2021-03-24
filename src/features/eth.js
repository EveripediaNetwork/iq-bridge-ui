import React, { useContext, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { ArrowDownShort } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { WallerProviderContext as UALContext } from "../context/walletProvider/walletProviderFacade";
import Layout from "../components/layouts/layout";
import SwapContainer from "../components/ui/swapContainer";
import CardTitle from "../components/ui/cardTitle";
import InfoAlert from "../components/ui/infoAlert";
import AddressContainer from "../components/ui/addressContainer";
import { convertTokensTx } from "../utils/EosDataProvider";

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

const MainCard = styled(Card)``;

const Eth = () => {
  const { t } = useTranslation();
  const methods = useForm({ mode: "onChange" });
  const authContext = useContext(UALContext);
  const [txDone, setTxDone] = useState(false);
  const [token1, setToken1] = React.useState({
    icon: "https://mindswap.finance/tokens/iq.png",
    name: "pIQ",
    precision: 3,
  });

  const onSubmit = async (data) => {
    if (!authContext.activeUser) {
      authContext.showModal();
      return;
    }
    await convertTokensTx(
      `${parseFloat(data.FromAmount).toFixed(3)} ${data.FromToken}`,
      data.address,
      authContext
    );

    setTxDone(true);
  };

  const onInputClick = (value, field, ref) => {
    const initValue = parseFloat(value) ? parseFloat(value) : 0;
    const handleClickout = (e) => {
      const updatedValue = parseFloat(methods.getValues(field))
        ? parseFloat(methods.getValues(field))
        : 0;
      if (ref.current && !ref.current.contains(e.target)) {
        if (updatedValue === 0) {
          methods.setValue(field, "0.000");
        } else {
          methods.setValue(field, methods.getValues(field));
        }
        document.removeEventListener("click", handleClickout);
      }
    };
    if (initValue === 0) {
      methods.setValue(field, " ");
      document.addEventListener("click", handleClickout);
    } else {
      methods.setValue(field, value);
      document.addEventListener("click", handleClickout);
    }
  };

  return (
    <Layout update={false}>
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
                      onInputClick={onInputClick}
                    />
                    <div className="d-flex justify-content-center">
                      <IconWrapper bsPrefix="switch" onClick={() => {}}>
                        <ArrowDownShort />
                      </IconWrapper>
                    </div>
                    <br />
                    <Button
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
              </MainCard>
            </Col>
          </Row>
          {!authContext.activeUser && txDone && (
            <Row>
              <Col>
                <InfoAlert text="Tx executed" />
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

export default React.memo(Eth);
