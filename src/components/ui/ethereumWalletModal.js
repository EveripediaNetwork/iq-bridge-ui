import React from "react";
import { Container, Modal, Row, Col, Card } from "react-bootstrap";
import styled from "styled-components";
import { useWallet } from "use-wallet";
import { useTranslation } from "react-i18next";

import MetaMaskSvg from "../../static/assets/MetaMask.svg";
import PortisSvg from "../../static/assets/portis.svg";
import FrameSvg from "../../static/assets/Frame.svg";
import FortmaticSvg from "../../static/assets/Fortmatic.svg";
import WalletConnectSvg from "../../static/assets/WalletConnect.svg";
import TorusSvg from "../../static/assets/Torus.svg";

const StyledWalletCard = styled(Card)`
  min-width: 150px !important;
  max-width: 185px;
  text-align: center;
  min-height: 80px;
  cursor: pointer;
  height: 100px;
`;

const StyledWalletSvg = styled(Card.Img)`
  max-width: 45px;
`;

const EthereumWalletModal = ({ ...otherProps }) => {
  const { t } = useTranslation();
  const wallet = useWallet();
  const activate = connector => {
    wallet.reset();
    wallet.connect(connector);
  };
  return (
    <Modal
      {...otherProps}
      size="md"
      aria-labelledby="login-modal"
      centered
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {t("select_wallet")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className="justify-content-md-center justify-content-center m-1">
            <Col sm={5} className="p-1">
              <StyledWalletCard
                className="p-2 shadow-sm mx-auto"
                key="injected"
                onClick={() => {
                  activate("injected");
                  localStorage.setItem(
                    "__WALLET_CONNECTED",
                    JSON.stringify("injected")
                  );
                }}
              >
                <div className="d-flex flex-row justify-content-center">
                  <StyledWalletSvg variant="top" src={MetaMaskSvg} />
                </div>
                <Card.Body className="p-1">
                  <div className="card-title h6">MetaMask</div>
                </Card.Body>
              </StyledWalletCard>
            </Col>
            <Col sm={5} className="p-1">
              <StyledWalletCard
                className="p-2 shadow-sm mx-auto"
                key="portis"
                onClick={() => {
                  activate("portis");
                  localStorage.setItem(
                    "__WALLET_CONNECTED",
                    JSON.stringify("portis")
                  );
                }}
              >
                <div className="d-flex flex-row justify-content-center">
                  <StyledWalletSvg variant="top" src={PortisSvg} />
                </div>
                <Card.Body className="p-1">
                  <div className="card-title h6">Portis</div>
                </Card.Body>
              </StyledWalletCard>
            </Col>
          </Row>

          <Row className="justify-content-md-center justify-content-center m-1">
            <Col sm={5} className="p-1">
              <StyledWalletCard
                className="p-2 shadow-sm mx-auto"
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
                <div className="d-flex flex-row justify-content-center">
                  <StyledWalletSvg variant="top" src={FrameSvg} />
                </div>
                <Card.Body className="p-1">
                  <div className="card-title h6">Frame</div>
                </Card.Body>
              </StyledWalletCard>
            </Col>
            <Col sm={5} className="p-1">
              <StyledWalletCard
                className="p-2 shadow-sm mx-auto"
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
                <div className="d-flex flex-row justify-content-center">
                  <StyledWalletSvg variant="top" src={FortmaticSvg} />
                </div>
                <Card.Body className="p-1">
                  <div className="card-title h6">Fortmatic</div>
                </Card.Body>
              </StyledWalletCard>
            </Col>
          </Row>
          <Row className="justify-content-md-center justify-content-center m-1">
            <Col sm={5} className="p-1">
              <StyledWalletCard
                className="p-2 shadow-sm mx-auto"
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
                <div className="d-flex flex-row justify-content-center">
                  <StyledWalletSvg variant="top" src={WalletConnectSvg} />
                </div>
                <Card.Body className="p-1">
                  <div className="card-title h6">WalletConnect</div>
                </Card.Body>
              </StyledWalletCard>
            </Col>
            <Col sm={5} className="p-1">
              <StyledWalletCard
                className="p-2 shadow-sm mx-auto"
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
                <div className="d-flex flex-row justify-content-center">
                  <StyledWalletSvg variant="top" src={TorusSvg} />
                </div>
                <Card.Body className="p-1">
                  <div className="card-title h6">Torus</div>
                </Card.Body>
              </StyledWalletCard>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default EthereumWalletModal;
