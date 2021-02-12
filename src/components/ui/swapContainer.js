import { ChevronDown } from "react-bootstrap-icons";
import { Button, Form } from "react-bootstrap";
import React, {useRef} from "react";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useUserTokensState } from "../../context/userTokensProvider/userTokensContext";
import { formatTokenBalance } from "../../utils/EosDataProvider";

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

const SwapTokenSelectContainer = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px !important;
  border-radius: 15px;
  margin: 0px !important;
  padding: 10px !important;
  margin-top: 10px !important;
  margin-bottom: 10px !important;
  span {
    margin-right: 3px;
  }
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

const SwapContainer = ({
  token,
  setToken,
  header,
  onSwapTokenClick,
  onSwapTokenChange,
  hideLabel,
  onInputClick,
}) => {
  const { t } = useTranslation();
  const { userTokens } = useUserTokensState();
  const { register } = useFormContext();
  const balToken = userTokens.find((to) => to.name === token?.name);
  const balance = balToken ? formatTokenBalance(balToken) : 0;
  const swapRef = useRef();
  return (
    <SwapContainerWrapper>
      <SwapTokenHeader className="text-capitalize">
        <SwapBalance
          onClick={() =>
            onSwapTokenChange &&
            onSwapTokenChange(`${balance}`, `${header}BalanceClick`)
          }
        >
          {`${t("balance")}: ${balance}`}
        </SwapBalance>
        <SwapHeader>{!hideLabel && t(header.toLowerCase())}</SwapHeader>
      </SwapTokenHeader>
      <SwapTokenContainer>
        <SwapTokenInputContainer>
          <SwapTokenInput
            autoComplete="off"
            name={`${header}Amount`}
            placeholder={token ? `0.${"0".repeat(token.precision)}` : "0.0000"}
            ref={e => {
              register(e, { required: true });
              swapRef.current=e
            }}
            onChange={(e) =>
              onSwapTokenChange &&
              onSwapTokenChange(e.target.value, `${header}Amount`)
            }
            onClick={(e) =>
              onInputClick && 
              onInputClick(e.target.value, `${header}Amount`, swapRef)
            }
          />
        </SwapTokenInputContainer>

        <Form.Control
          type="hidden"
          name={`${header}Token`}
          value={token ? token.name : ""}
          ref={register({ required: true })}
        />
        {token && (
          <SwapTokenListButton
            onClick={() => {
              onSwapTokenClick(setToken, token.name);
            }}
          >
            <SwapTokenIcon src={token.icon} />
            <SwapTokenName>{token.name}</SwapTokenName>
            <ChevronDown color="black" />
          </SwapTokenListButton>
        )}
        {!token && (
          <SwapTokenSelectContainer
            variant="secondary"
            onClick={() => {
              onSwapTokenClick(setToken, null);
            }}
          >
            <span>{t("select_token")}</span>
            <ChevronDown />
          </SwapTokenSelectContainer>
        )}
      </SwapTokenContainer>
    </SwapContainerWrapper>
  );
};

SwapContainer.propTypes = {
  token: PropTypes.any,
  setToken: PropTypes.func,
  header: PropTypes.string.isRequired,
  onSwapTokenClick: PropTypes.func.isRequired,
  onSwapTokenChange: PropTypes.func.isRequired,
  hideLabel: PropTypes.bool,
  onInputClick: PropTypes.func.isRequired,
};

SwapContainer.defaultProps = {
  hideLabel: false,
};

export default SwapContainer;
