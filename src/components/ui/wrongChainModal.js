import React from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";

const StyledModal = styled(Modal)`
  padding: 10px;
  border-radius: 15px;
`;

const WrongChainModal = ({ ...props }) => {
  return (
    <StyledModal
      {...props}
      size="sm"
      aria-labelledby="wrong-chain-modal"
      centered
      className="rounded"
    >
      <Modal.Header closeButton className="px-3 py-2">
        <Modal.Title>Wrong Network</Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-3 py-2">
        <p>Please connect to the appropiate Ethereum Network</p>
      </Modal.Body>
    </StyledModal>
  );
};

WrongChainModal.propTypes = {};

export default WrongChainModal;
