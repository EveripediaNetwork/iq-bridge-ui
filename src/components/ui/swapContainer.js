import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { UALContext } from "ual-reactjs-renderer";
import { useWallet } from "use-wallet";
import { ArrowBarDown } from "react-bootstrap-icons";

import { getUserTokenBalance } from "../../utils/EosDataProvider";
import { maticChainId } from "../../config";
import {
  getPTokensUserBalance,
  getTokensUserBalanceMatic
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

const SwapTokenContainer = styled.div`
  display: grid;
  grid-template-columns: 45% auto;
  justify-content: space-between;
`;

const SwapTokenInput = styled.input`
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

const ClickToFillBtn = styled(Button)`
  :hover {
    color: black;
  }
`;

const SwapContainer = ({ token, header, setFilled, setParentBalance }) => {
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
      } else if (
        wallet.account &&
        token.name === "IQ" &&
        wallet.chainId === maticChainId
      ) {
        const balance = Number(await getTokensUserBalanceMatic(wallet));
        setBalance(balance);
        setParentBalance(balance);
      }
    })();
  }, [authContext, wallet, token]);

  const handleTriggerFillInput = () => {
    swapRef.current.value = balToken;
    setFilled(swapRef.current.value);
  };

  const handleOnInputChange = event => {
    let { value } = event.target;
    const { min, max } = event.target;
    value = Math.max(Number(min), Math.min(Number(max), Number(value)));
    swapRef.current.value = value;
    setFilled(value);
  };

  return (
    <SwapContainerWrapper>
      <SwapTokenHeader className="text-capitalize">
        <SwapBalance>
          {`${t("balance")}: ${balToken}`}
          <ClickToFillBtn
            size="sm"
            variant="light"
            onClick={handleTriggerFillInput}
            className="mx-2 pt-0 mb-1"
          >
            <ArrowBarDown />
          </ClickToFillBtn>
        </SwapBalance>
        <SwapHeader>{t(header.toLowerCase())}</SwapHeader>
      </SwapTokenHeader>
      <SwapTokenContainer>
        <div>
          <SwapTokenInput
            type="number"
            min={0}
            max={balToken}
            disabled={wallet.account === null}
            name={`${header}Amount`}
            placeholder={token ? `0.${"0".repeat(token.precision)}` : "0.000"}
            onChange={handleOnInputChange}
            ref={e => {
              register(e, { required: true });
              swapRef.current = e;
            }}
          />
        </div>

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
  setFilled: PropTypes.func,
  setParentBalance: PropTypes.func
};

SwapContainer.defaultProps = {
  setFilled: () => {},
  setParentBalance: () => {}
};

export default SwapContainer;
