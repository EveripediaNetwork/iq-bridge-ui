import { ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import { CircleFill, CheckCircleFill } from "react-bootstrap-icons";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SearchInput, { createFilter } from "react-search-input";
import { useTranslation } from "react-i18next";

const SwapTokenIcon = styled.img`
  width: 30px;
`;
const StyledModal = styled(Modal)`
  div {
    max-width: 400px;
    border-radius: 15px;
    border-bottom: 0px;
  }

  .modal-title {
    font-size: 20px;
    color: #206acb;
  }

  .modal-body {
    padding: 1rem !important;
  }

  .list-group-item {
    border: 0px;
  }
`;
const StyledSearchInput = styled(SearchInput)`
  padding: 0px 8px 10px 10px;
  height: 30px;
  position: relative;

  ::before {
    content: "🔍";
    display: block;
    position: absolute;
    z-index: 3;
    top: 0;
    left: 25px;
    line-height: 32px;
    opacity: 0.6;
  }
  input {
    width: 97%;
    background-color: #f2f2f2;
    font-size: 18px;
    border: none;
    border-radius: 12px;
    line-height: 22px;
    padding: 4px 10px 7px 33px;
    height: 32px;
    position: relative;
    left: 5px;
    &:focus {
      outline: none;
    }
  }
`;

const StyledListGroupItem = styled(ListGroupItem)`
  &&& {
    border-bottom: 1px solid #f2f2f2;
    padding-left: 5px;
  }
`;

const StyledListGroup = styled(ListGroup)`
  border: 1px solid #f2f2f2;
  padding: 0;
`;

const StyledContractName = styled.span`
  position: absolute;
  left: 45%;
  color: #999;
  font-weight: 300;
`;

const StyledCircleFill = styled(CircleFill)`
  color: #d3d3d3;
  position: absolute;
  left: 90%;
  height: 50%;
`;

const StyledCheckCircleFill = styled(CheckCircleFill)`
  color: #206acb;
  position: absolute;
  left: 90%;
  height: 50%;
`;
const keysToFilter = ["name", "contract"];

const TokenListModal = ({ onSelectToken, callBackSwap, ...otherProps }) => {
  const { t } = useTranslation();
  const [tokens, setTokens] = useState([]);

  const { prevToken } = callBackSwap || {};
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTokens, setFilteredTokens] = useState(
    tokens.filter(createFilter(searchTerm, keysToFilter))
  );

  const shouldBeDisabled = (token) => {
    const selectedToken = tokens.find(
      (t) => t.isSelected && prevToken !== t.name
    );
    if (selectedToken === undefined) {
      return false;
    }
    const isAllowed = selectedToken.allowedTrades.find(
      (trade) => trade.token === token.name
    );
    return isAllowed === undefined;
  };

  const shouldBeToggled = (token) => {
    if (token.name === prevToken) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    setFilteredTokens(tokens.filter(createFilter(searchTerm, keysToFilter)));
  }, [searchTerm, tokens]);

  return (
    <StyledModal
      {...otherProps}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable
      onExited={() => setSearchTerm("")}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {t("select_token")}
        </Modal.Title>
      </Modal.Header>
      <StyledSearchInput
        className="search-input"
        onChange={(e) => setSearchTerm(e)}
      />
      <Modal.Body>
        <StyledListGroup variant="flush">
          {filteredTokens.map((token) =>
            shouldBeDisabled(token) ? null : (
              <StyledListGroupItem
                key={token.name}
                action
                onClick={() => {
                  !shouldBeDisabled(token) &&
                    onSelectToken({
                      name: token.name,
                      icon: token.icon,
                      precision: token.precision,
                      contract: token.contract,
                    });
                }}
              >
                <SwapTokenIcon src={token.icon} /> {token.name}
                <StyledContractName>{token.contract}</StyledContractName>
                {shouldBeToggled(token) ? (
                  <StyledCheckCircleFill color="#2273DD" />
                ) : (
                  <StyledCircleFill color="#d3d3d3" />
                )}
              </StyledListGroupItem>
            )
          )}
        </StyledListGroup>
      </Modal.Body>
    </StyledModal>
  );
};

TokenListModal.propTypes = {
  onSelectToken: PropTypes.func.isRequired,
  callBackSwap: PropTypes.any // contains prevToken
};

export default TokenListModal;
