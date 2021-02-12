import React, { useCallback, useEffect, useState, useContext } from "react";
import { useForm, FormProvider } from "react-hook-form";
import styled from "styled-components";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { ArrowDownShort } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { WallerProviderContext as UALContext } from "../context/walletProvider/walletProviderFacade";
import Layout from "../components/layouts/layout";
import SwapContainer from "../components/ui/swapContainer";
import {
  useTokensDispatch,
  useTokensState,
} from "../context/tokensProvider/tokensContext";
import CardTitle from "../components/ui/cardTitle";
import InfoAlert from "../components/ui/infoAlert";
import TokenListModal from "../components/ui/tokenListModal";
import TransactionModal, {
  TRANSACTION_STATUS,
} from "../components/ui/transactionModal";
import {
  exchange,
  getExchangeAssets,
  getExchangeAssetsFromToken2,
} from "../utils/EosDataProvider";

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

const initialTransactionStatus = {
  status: TRANSACTION_STATUS.LOADING,
  txid: null,
  error: null,
};

const Home = () => {
  const { t } = useTranslation();
  const tokenDispatch = useTokensDispatch();
  const methods = useForm({ mode: "onChange" });
  const { tokens } = useTokensState();
  const [pairs, setPairs] = useState();
  const [tokenModalShow, setTokenModalShow] = useState(false);
  const [transactionModalShow, setTransactionModalShow] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(
    initialTransactionStatus
  );
  const [callBackSwap, setCallBackSwap] = useState(null);
  const [loading, isLoading] = useState(true);
  const authContext = useContext(UALContext);
  const [token1, setToken1] = React.useState();
  const [token2, setToken2] = React.useState();
  const [refreshArray, setRefreshArray] = React.useState([]);

  // init load?
  useEffect(() => {
    tokenDispatch({ type: "CLEAN_SELECTED_TOKEN" });
    isLoading(false);
  }, [tokenDispatch, isLoading]);

  const onSubmit = async (data) => {
    if (!authContext.activeUser) {
      authContext.showModal();
      return;
    }
    setTransactionModalShow(true);
    setTransactionStatus(initialTransactionStatus);
    try {
      const toTokenIsPrediqtToken = false;
      const { transactionId } = await exchange(
        data?.FromAmount,
        pairs,
        authContext,
        toTokenIsPrediqtToken,
        0
      );
      setTransactionStatus({
        status: TRANSACTION_STATUS.CONFIRMED,
        txid: transactionId,
      });
    } catch (e) {
      console.log(e);
      setTransactionStatus({
        status: TRANSACTION_STATUS.ERROR,
        error: e.message,
      });
    }
  };

  const openModal = useCallback(
    (callback, name) => {
      setTokenModalShow(true);
      setCallBackSwap({ func: callback, prevToken: name });
    },
    [setTokenModalShow, setCallBackSwap, tokenDispatch]
  );

  const closeModal = useCallback(
    ({ name, icon, contract, precision }) => {
      setTokenModalShow(false);
      if (callBackSwap && callBackSwap.prevToken) {
        tokenDispatch({
          type: "UNSELECT_TOKEN",
          payload: callBackSwap.prevToken,
        });
      }
      callBackSwap.func({
        name,
        icon,
        contract,
        precision,
      });
      tokenDispatch({ type: "SELECT_TOKEN", payload: name });
    },
    [callBackSwap, tokenDispatch]
  );

  const handleAmountOnChange = useCallback(
    (value, field) => {
      if (!pairs) {
        switch (field) {
          case "FromBalanceClick":
            methods.setValue("FromAmount", value.toString().split(" ")[0]);
            break;
          case "ToBalanceClick":
            methods.setValue("ToAmount", value.toString().split(" ")[0]);
            break;
          default:
            break; // no pools
        }
        return; // no pools
      }
      let assets;
      switch (field) {
        case "FromAmount":
          assets = getExchangeAssets(value, pairs, 0);
          methods.setValue(
            "ToAmount",
            assets.assetToReceive.toString().split(" ")[0]
          );
          break;
        case "ToAmount":
          assets = getExchangeAssetsFromToken2(value, pairs, 0);
          methods.setValue(
            "FromAmount",
            assets.assetToGive.toString().split(" ")[0]
          );
          break;
        case "FromBalanceClick":
          methods.setValue("FromAmount", value.toString().split(" ")[0]);
          assets = getExchangeAssets(value, pairs, 0);
          methods.setValue(
            "ToAmount",
            assets.assetToReceive.toString().split(" ")[0]
          );
          break;
        case "ToBalanceClick":
          methods.setValue("ToAmount", value.toString().split(" ")[0]);
          assets = getExchangeAssetsFromToken2(value, pairs, 0);
          methods.setValue(
            "FromAmount",
            assets.assetToGive.toString().split(" ")[0]
          );
          break;
        default:
          break;
      }
    },
    [pairs, 0]
  );

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

  if (loading) {
    return <></>;
  }

  const resetValues = () => {
    setRefreshArray([
      ...refreshArray,
      { contract: token1.contract, name: token1.name },
      { contract: token2.contract, name: token2.name },
    ]);
    tokenDispatch({ type: "CLEAN_SELECTED_TOKEN" });
    setPairs();
    const defaultToken1 = tokens.find((token) => token.isDefault);
    setToken1(defaultToken1);
    methods.setValue("ToAmount", "0.000");
    setToken2();
    methods.setValue("FromAmount", "0.000");
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
                      initialToken={null}
                      setModalShow={setTokenModalShow}
                      onSwapTokenClick={openModal}
                      onSwapTokenChange={handleAmountOnChange}
                      onInputClick={onInputClick}
                    />
                    <div className="d-flex justify-content-center">
                      <IconWrapper bsPrefix="switch" onClick={() => {}}>
                        <ArrowDownShort />
                      </IconWrapper>
                    </div>
                    <SwapContainer
                      token={token2}
                      setToken={setToken2}
                      header="To"
                      initialToken={null}
                      setModalShow={setTokenModalShow}
                      onSwapTokenClick={openModal}
                      onSwapTokenChange={handleAmountOnChange}
                      onInputClick={onInputClick}
                    />
                    <br />
                    <Button
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
          {!authContext.activeUser && (
            <Row>
              <Col>
                <InfoAlert text={t("login_info")} />
              </Col>
            </Row>
          )}
          <TokenListModal
            onSelectToken={closeModal}
            show={tokenModalShow}
            onHide={() => setTokenModalShow(false)}
            callBackSwap={callBackSwap}
          />
          <TransactionModal
            status={transactionStatus}
            show={transactionModalShow}
            onHide={() => {
              setTransactionModalShow(false);
              if (transactionStatus.status === TRANSACTION_STATUS.CONFIRMED) {
                resetValues();
              }
            }}
          />
        </FormProvider>
      </Container>
    </Layout>
  );
};

export default React.memo(Home);
