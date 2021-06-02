import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";

const StyledModal = styled(Modal)`
  padding: 10px;
  border-radius: 15px;
`;

const WrongChainModal = ({ currentChainId, ethChainId, ...props }) => {
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
        <p>
          Please connect to the{" "}
          {currentChainId === ethChainId
            ? "appropiate Ethereum Network"
            : "Matic Network"}
        </p>
      </Modal.Body>
    </StyledModal>
  );
};

WrongChainModal.propTypes = {
  currentChainId: PropTypes.number.isRequired,
  ethChainId: PropTypes.number.isRequired
};

export default WrongChainModal;
