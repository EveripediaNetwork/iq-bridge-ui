import { Form } from "react-bootstrap";
import React, { useRef } from "react";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";

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

const AddressContainer = () => {
  const { register } = useFormContext();
  const swapRef = useRef();
  return (
    <SwapContainerWrapper>
      <SwapTokenHeader className="text-capitalize">
        Your Ethereum Address
      </SwapTokenHeader>
      <SwapTokenContainer>
        <SwapTokenInputContainer>
          <SwapTokenInput
            autoComplete="off"
            name="address"
            placeholder="0x0"
            ref={(e) => {
              register(e, { required: true });
              swapRef.current = e;
            }}
          />
        </SwapTokenInputContainer>
      </SwapTokenContainer>
    </SwapContainerWrapper>
  );
};

export default AddressContainer;
