import React, { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const SwapContainerWrapper = styled.div`
  border-radius: 5px;
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
`;

const SwapTokenInputContainer = styled.div``;

const SwapTokenInput = styled(Form.Control)`
  border: 0px !important;
  padding: 5px !important;
  font-size: 16px !important;

  :focus {
    box-shadow: none !important;
  }

  @media (max-width: 768px) {
    font-size: 25px !important;
  }
`;

const AddressContainer = ({
  title = "your_eth_address",
  placeholder = "0x0",
  pattern = ""
}) => {
  const { t } = useTranslation();
  const { register } = useFormContext();
  const swapRef = useRef();
  const [isInvalid, setInvalid] = useState(false);

  const handleOnInputChange = event => {
    const { value } = event.target;
    swapRef.current.value = value;
    const result = new RegExp(pattern).test(value);
    setInvalid(!result);
  };

  return (
    <SwapContainerWrapper>
      <SwapTokenHeader className="text-capitalize">{t(title)}</SwapTokenHeader>
      <SwapTokenContainer>
        <SwapTokenInputContainer>
          <SwapTokenInput
            isInvalid={isInvalid}
            pattern={pattern}
            autoComplete="off"
            name="address"
            onChange={handleOnInputChange}
            placeholder={placeholder}
            ref={e => {
              register(e, { required: true });
              swapRef.current = e;
            }}
          />
        </SwapTokenInputContainer>
      </SwapTokenContainer>
    </SwapContainerWrapper>
  );
};

AddressContainer.propTypes = {
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  pattern: PropTypes.string.isRequired
};

export default AddressContainer;
