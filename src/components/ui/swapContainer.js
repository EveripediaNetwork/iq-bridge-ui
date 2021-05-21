import { Button, Form } from "react-bootstrap";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { UALContext } from "ual-reactjs-renderer";
import { useWallet } from "use-wallet";
import { getUserTokenBalance } from "../../utils/EosDataProvider";
import {
  getPTokensUserBalance,
  getTokensUserBalanceMatic
} from "../../utils/EthDataProvider";

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

const SwapTokenContainer = styled.div`
  display: grid;
  grid-template-columns: 45% auto;
  justify-content: space-between;
`;

const SwapTokenInputContainer = styled.div``;

const SwapTokenInput = styled(Form.Control)`
  border: 0px !important;
  padding: 5px !important;
  font-size: 30px !important;

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
`;

const SwapHeader = styled.div`
  justify-self: flex-end;
`;

const SwapContainer = ({ token, header, setFilled }) => {
  const { t } = useTranslation();
  const { register } = useFormContext();
  const swapRef = useRef();
  const authContext = useContext(UALContext);
  const wallet = useWallet();
  const [balToken, setBalance] = useState("0");
  useEffect(() => {
    (async () => {
      if (authContext.activeUser && token.name === "IQ") {
        setBalance(await getUserTokenBalance(authContext));
      } else if (wallet.account && token.name === "pIQ") {
        setBalance(await getPTokensUserBalance(wallet));
      } else if (wallet.account && token.name === "IQ") {
        setBalance(await getTokensUserBalanceMatic(wallet));
      }
    })();
  }, [authContext, wallet, token]);

  return (
    <SwapContainerWrapper>
      <SwapTokenHeader className="text-capitalize">
        <SwapBalance>{`${t("balance")}: ${balToken}`}</SwapBalance>
        <SwapHeader>{t(header.toLowerCase())}</SwapHeader>
      </SwapTokenHeader>
      <SwapTokenContainer>
        <SwapTokenInputContainer>
          <SwapTokenInput
            autoComplete="off"
            name={`${header}Amount`}
            placeholder={token ? `0.${"0".repeat(token.precision)}` : "0.000"}
            onChange={e => setFilled(e.target.value)}
            ref={e => {
              register(e, { required: true });
              swapRef.current = e;
            }}
          />
        </SwapTokenInputContainer>

        <Form.Control
          type="hidden"
          name={`${header}Token`}
          value={token ? token.name : ""}
          ref={register({ required: true })}
        />
        <SwapTokenListButton>
          <SwapTokenIcon src={token.icon} />
          <SwapTokenName>{token.name}</SwapTokenName>
        </SwapTokenListButton>
      </SwapTokenContainer>
    </SwapContainerWrapper>
  );
};

SwapContainer.propTypes = {
  token: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  header: PropTypes.string.isRequired,
  setFilled: PropTypes.func.isRequired
};

export default SwapContainer;
