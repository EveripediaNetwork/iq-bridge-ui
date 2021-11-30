import React from "react";
import { Container, Modal, Row, Col, Card } from "react-bootstrap";
import styled from "styled-components";
import PropTypes from "prop-types";
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

const EthereumWalletModal = ({ show, setShow }) => {
  const { t } = useTranslation();
  const wallet = useWallet();
  const activate = connector => {
    wallet.reset();
    wallet.connect(connector);
  };

  const handleWalletButtonClick = value => {
    activate(value);
    localStorage.setItem("__WALLET_CONNECTED", JSON.stringify(value));
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
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
                onClick={() => handleWalletButtonClick("injected")}
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
                onClick={() => handleWalletButtonClick("portis")}
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
                action="true"
                onClick={() => handleWalletButtonClick("frame")}
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
                onClick={() => handleWalletButtonClick("fortmatic")}
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
                onClick={() => handleWalletButtonClick("walletconnect")}
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
                onClick={() => handleWalletButtonClick("torus")}
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

EthereumWalletModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired
};

export default EthereumWalletModal;
