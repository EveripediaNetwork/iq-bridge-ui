import { ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import React from "react";
import styled from "styled-components";
import { useWallet } from "use-wallet";
import { useTranslation } from "react-i18next";

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

const EthereumWalletModal = ({ ...otherProps }) => {
  const { t } = useTranslation();
  const wallet = useWallet();
  const activate = connector => wallet.connect(connector);
  return (
    <StyledModal
      {...otherProps}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable
      onExited={() => {}}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {t("select_wallet")}:
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="connect">
          <div className="connect-buttons">
            <StyledListGroup variant="flush">
              <StyledListGroupItem
                key="injected"
                action
                onClick={() => {
                  activate("injected");
                  localStorage.setItem(
                    "__WALLET_CONNECTED",
                    JSON.stringify("injected")
                  );
                }}
              >
                Metamask
              </StyledListGroupItem>

              <StyledListGroupItem
                key="portis"
                action
                onClick={() => {
                  activate("portis");
                  localStorage.setItem(
                    "__WALLET_CONNECTED",
                    JSON.stringify("portis")
                  );
                }}
              >
                Portis
              </StyledListGroupItem>

              <StyledListGroupItem
                key="frame"
                action
                onClick={() => {
                  activate("frame");
                  localStorage.setItem(
                    "__WALLET_CONNECTED",
                    JSON.stringify("frame")
                  );
                }}
              >
                Frame
              </StyledListGroupItem>

              <StyledListGroupItem
                key="fortmatic"
                action
                onClick={() => {
                  activate("fortmatic");
                  localStorage.setItem(
                    "__WALLET_CONNECTED",
                    JSON.stringify("fortmatic")
                  );
                }}
              >
                Fortmatic
              </StyledListGroupItem>

              <StyledListGroupItem
                key="walletconnect"
                action
                onClick={() => {
                  activate("walletconnect");
                  localStorage.setItem(
                    "__WALLET_CONNECTED",
                    JSON.stringify("walletconnect")
                  );
                }}
              >
                walletconnect
              </StyledListGroupItem>

              <StyledListGroupItem
                key="torus"
                action
                onClick={() => {
                  activate("torus");
                  localStorage.setItem(
                    "__WALLET_CONNECTED",
                    JSON.stringify("torus")
                  );
                }}
              >
                torus
              </StyledListGroupItem>

              <StyledListGroupItem
                key="walletlink"
                action
                onClick={() => {
                  activate("walletlink");
                  localStorage.setItem(
                    "__WALLET_CONNECTED",
                    JSON.stringify("walletlink")
                  );
                }}
              >
                walletlink
              </StyledListGroupItem>
            </StyledListGroup>
          </div>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

export default EthereumWalletModal;
