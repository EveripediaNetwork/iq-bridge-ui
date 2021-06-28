import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { UALContext } from "ual-reactjs-renderer";
import { useWallet } from "use-wallet";

import { getUserTokenBalance } from "../../utils/EosDataProvider";
import {
  getPTokensUserBalance,
  getTokensUserBalance
} from "../../utils/EthDataProvider/EthDataProvider";

const SwapContainerWrapper = styled.div`
  border-radius: 15px;
  border: 1px solid #e0e0e0;
  padding: 10px;
  display: grid;
`;

const SwapTokenHeader = styled.div`
  font-size: 14px;
  float: left;
  text-align: left;
  color: #aeabab;
  margin: 5px;
  display: flex;
  flex-direction: row;
`;

const SwapTokenInput = styled(Form.Control)`
  border: 0px !important;
  padding: 5px !important;
  font-size: 30px !important;
  max-width: 100%;

  :focus {
    box-shadow: none !important;
  }

  @media (max-width: 768px) {
    font-size: 25px !important;
  }
`;

const SwapTokenListButton = styled(Button)`
  display: flex !important;
  text-align: right !important;
  align-items: center;
  justify-content: center;
  background-color: white !important;
  border: 0px !important;
  width: fit-content;
  height: 100%;
  margin: 0;
  vertical-align: middle;
`;

const SwapTokenName = styled.span`
  margin-left: 5px;
  font-weight: 500;
  color: black;
  margin-right: 5px;
  font-size: 25px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const SwapTokenIcon = styled.img`
  width: 30px;

  @media (max-width: 768px) {
    width: 20px;
  }
`;

const SwapBalance = styled.div`
  justify-self: flex-start;
  flex-grow: 1;
  cursor: pointer;
  max-width: 100%;
`;

const SwapHeader = styled.div`
  justify-self: flex-end;
`;

const ClickToFillBtn = styled(Button)`
  margin: 0 !important;
  padding: 0 !important;
  color: #aeabab !important;

  :hover {
    color: black;
  }
`;

const inputDisabled = (chain, ethWallet, eosWallet) => {
  if (chain === "Ethereum" && ethWallet.account === null) {
    return true;
  }
  if (chain === "EOS" && !eosWallet.activeUser) {
    return true;
  }
  return false;
};

const SwapContainer = ({ token, header, setFilled, setParentBalance }) => {
  const { t } = useTranslation();
  const { register } = useFormContext();
  const swapRef = useRef();
  const authContext = useContext(UALContext);
  const wallet = useWallet();
  const [balToken, setBalance] = useState("0");
  const [isValidInput, setIsValidInput] = useState();

  useEffect(() => {
    (async () => {
      if (
        token.chain === "EOS" &&
        authContext.activeUser &&
        token.name === "IQ"
      ) {
        const balance = await getUserTokenBalance(authContext);
        if (balance) setBalance(balance.toString().replace(" IQ", ""));
      } else if (
        token.chain === "Ethereum" &&
        wallet.account &&
        token.name === "pIQ"
      ) {
        setBalance(await getPTokensUserBalance(wallet));
      } else if (
        token.chain === "Ethereum" &&
        wallet.account &&
        token.name === "IQ"
      ) {
        const balance = Number(await getTokensUserBalance(wallet));
        setBalance(balance);
        setParentBalance(balance);
      }
    })();
  }, [authContext, wallet, token]);

  const handleTriggerFillInput = () => {
    if (!isValidInput) setIsValidInput(true);

    swapRef.current.value = balToken;
    setFilled(swapRef.current.value);
  };

  const handleOnInputChange = event => {
    let { value } = event.target;
    value = Number(value);

    if (Number.isNaN(value) || value < 0 || value > balToken) {
      setIsValidInput(false);
      setFilled(undefined);
      return;
    }

    setIsValidInput(true);

    if (value === 0) return;

    setFilled(value);
  };

  return (
    <SwapContainerWrapper>
      <SwapTokenHeader className="text-capitalize">
        <SwapBalance>
          <ClickToFillBtn
            size="sm"
            variant="transparent"
            onClick={handleTriggerFillInput}
          >
            {`${t("balance")}: ${balToken}`}
          </ClickToFillBtn>
        </SwapBalance>
        <SwapHeader>{t(header.toLowerCase())}</SwapHeader>
      </SwapTokenHeader>
      <Row className="d-flex flex-row justify-content-between">
        <Col xs={9} md={9} lg={9}>
          <SwapTokenInput
            type="text"
            min={0}
            isInvalid={isValidInput === false}
            max={balToken}
            disabled={inputDisabled(token.chain, wallet, authContext)}
            name="FromAmount"
            placeholder={token ? `0.${"0".repeat(token.precision)}` : "0.000"}
            onChange={handleOnInputChange}
            ref={e => {
              register(e, { required: true });
              swapRef.current = e;
            }}
          />
        </Col>
        <Col
          xs={3}
          md={3}
          lg={3}
          className="d-flex flex-row justify-content-end"
        >
          <Form.Control
            type="hidden"
            name="FromToken"
            value={token ? token.name : ""}
            ref={register({ required: true })}
          />
          <SwapTokenListButton className="p-0 m-0">
            <SwapTokenIcon src={token.icon} />
            <SwapTokenName>{token.name}</SwapTokenName>
          </SwapTokenListButton>
        </Col>
      </Row>
    </SwapContainerWrapper>
  );
};

SwapContainer.propTypes = {
  token: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  header: PropTypes.string.isRequired,
  setFilled: PropTypes.func,
  setParentBalance: PropTypes.func
};

SwapContainer.defaultProps = {
  setFilled: () => {},
  setParentBalance: () => {}
};

export default SwapContainer;
