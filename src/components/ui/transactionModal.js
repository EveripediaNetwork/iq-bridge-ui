import { Col, Container, Modal, Row, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import styled from "styled-components";
import { CheckCircle, XCircle } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const StyledModal = styled(Modal)`
  div {
    max-width: 400px;
    border-radius: 15px;
    border-bottom: 0px;
  }

  .modal-body {
    min-height: 300px;
    padding: 0.5rem !important;

    .confirmationText {
      margin: 10px;
      color: rgb(32, 106, 203);
      font-size: 25px;
    }
  }

  .list-group-item {
    border: 0px;
  }
`;

export const TRANSACTION_STATUS = {
  LOADING: "loading",
  ERROR: "error",
  CONFIRMED: "confirmed",
};

const TransactionModal = ({ status, ...otherProps }) => {
  const { t } = useTranslation();
  const [allowClosing, setAllowClosing] = useState(true);
  let StatusComponent;
  switch (status.status) {
    case TRANSACTION_STATUS.LOADING:
      if (allowClosing !== "static") {
        setAllowClosing("static");
      }
      StatusComponent = (
        <>
          <Spinner animation="border" variant="primary" />
          <div className="confirmationText">{t("confirming_tx")}</div>
        </>
      );
      break;
    case TRANSACTION_STATUS.CONFIRMED:
      if (allowClosing !== true) {
        setAllowClosing(true);
      }
      StatusComponent = (
        <>
          <CheckCircle color="#206acb" size={96} />
          <div className="confirmationText">{t("confirmed_tx")}</div>
          <a
            href={`https://bloks.io/transaction/${status.txid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            view transaction
          </a>
        </>
      );
      break;
    case TRANSACTION_STATUS.ERROR:
      if (allowClosing !== true) {
        setAllowClosing(true);
      }
      StatusComponent = (
        <>
          <XCircle color="red" size={96} />
          <div className="confirmationText">{t("something_wrong")}</div>
          <div>{status.error}</div>
        </>
      );
      break;
    default:
      break;
  }
  return (
    <StyledModal
      {...otherProps}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable
      backdrop={allowClosing}
    >
      <Modal.Body>
        <Container fluid>
          <Row>
            <Col
              className="text-center"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {StatusComponent}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </StyledModal>
  );
};

TransactionModal.propTypes = {
  status: PropTypes.shape({
    status: PropTypes.string.isRequired,
    txid: PropTypes.string,
    error: PropTypes.string,
  }).isRequired,
};

export default TransactionModal;
