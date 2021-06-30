import React, { useContext } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { WrongChainContext } from "../../context/wrongChainContext";

const StyledModal = styled(Modal)`
  padding: 10px;
  border-radius: 15px;
`;

const WrongChainModal = ({ ...props }) => {
  const { t } = useTranslation();
  const { openWrongChainDialog, setOpenWrongChainDialog } =
    useContext(WrongChainContext);

  return (
    <StyledModal
      show={openWrongChainDialog}
      onHide={() => setOpenWrongChainDialog(false)}
      {...props}
      size="sm"
      aria-labelledby="wrong-chain-modal"
      centered
      className="rounded"
    >
      <Modal.Header closeButton className="px-3 py-2">
        <Modal.Title>{t("wrong_chain_modal_title")}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-3 py-2">
        <p>{t("wrong_chain_modal_body")}</p>
      </Modal.Body>
    </StyledModal>
  );
};

WrongChainModal.propTypes = {};

export default WrongChainModal;
