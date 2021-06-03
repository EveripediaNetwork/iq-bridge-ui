import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

const TxDetailsDialog = ({ hash, from, to, ...props }) => {
  return (
    <Modal {...props} size="sm" centered>
      <Modal.Header closeButton className="px-3 py-2">
        <Modal.Title className="font-weight-light">
          Transaction details
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex flex-column justify-content-start">
          <p>From: {from}</p>
          <p>To: {to}</p>
        </div>
        <div className="d-flex flex-row justify-content-center">
          <Button variant="link">
            <a
              target="_blank"
              href={`https://goerli.etherscan.io/tx/${hash}`}
              rel="noopener noreferrer"
            >
              View on explorer
            </a>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

TxDetailsDialog.propTypes = {
  hash: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
};

TxDetailsDialog.defaultProps = {
  hash: "0x8827c2d6b21884b93884c8c5c3cced052f2dc1e5cc94390352690d3578bbd7bb",
  from: "0xAe65930180ef4d86dbD1844275433E9e1d6311ED",
  to: "0xC03bCACC5377b7cc6634537650A7a1D14711c1A3"
};

export default TxDetailsDialog;
