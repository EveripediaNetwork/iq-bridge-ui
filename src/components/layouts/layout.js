import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  Button,
  Container,
  Row,
  Col,
  Nav,
  Navbar,
  NavDropdown
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useWallet } from "use-wallet";

import { WallerProviderContext as UALContext } from "../../context/walletProvider/walletProviderFacade";
import GlobalStyle from "../globalStyles";
import LanguageSelector from "./LanguageMenu/LanguageSelector";
import EthereumWalletModal from "../ui/ethereumWalletModal";

const isWalletConnected = () => {
  const val = localStorage.getItem("__WALLET_CONNECTED");

  return val ? JSON.parse(val) : null;
};

const StyledButtonsRow = styled(Row)`
  min-width: 350px;
`;

const Layout = ({ children }) => {
  const location = useLocation();
  const authContext = useContext(UALContext);
  const { t, i18n } = useTranslation();
  const LngUrl = `?lng=${i18n.language}`;
  const [ethModalShow, setEthModalShow] = useState(false);
  const connectedId = isWalletConnected();
  const wallet = useWallet();
  if (wallet.status === "disconnected" && connectedId != null) {
    wallet.connect(connectedId);
  }

  return (
    <Container className="container-sm">
      <GlobalStyle />
      <Navbar expand="lg" className="p-3 font-weight-bold text-capitalize">
        <Navbar.Brand as={Link} to={`/${LngUrl}`}>
          <span title="iq bridge" role="img" aria-label="brain">
            🧠
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown
              active={
                location.pathname === "/" ||
                location.pathname === "/eth" ||
                location.pathname === "/reverseEth"
              }
              title="BRIDGE"
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item
                active={location.pathname === "/"}
                as={Link}
                to={`/${LngUrl}`}
              >
                EOS → pIQ
              </NavDropdown.Item>
              <NavDropdown.Item
                active={location.pathname === "/eth"}
                as={Link}
                to={`/eth${LngUrl}`}
              >
                pIQ → IQ
              </NavDropdown.Item>
              <NavDropdown.Item
                active={location.pathname === "/reverseEth"}
                as={Link}
                to={`/reverseEth${LngUrl}`}
              >
                ETH → EOS
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="https://wallet.matic.network/">
                ETH ↔ Matic
              </NavDropdown.Item>
              <NavDropdown.Item href="https://multichain.xyz/">
                ETH ↔ BSC
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link
              active={location.pathname === "/lock"}
              as={Link}
              to={`/lock${LngUrl}`}
            >
              {t("LOCK")}
            </Nav.Link>
            <Nav.Link
              active={location.pathname === "/voting"}
              as={Link}
              to={`/voting${LngUrl}`}
            >
              {t("VOTING")}
            </Nav.Link>
            <Nav.Link href="https://learn.everipedia.org/">
              {t("LEARN")}
            </Nav.Link>
          </Nav>
          <LanguageSelector className="pr-4" />
          <StyledButtonsRow xs={4} sm={4}>
            <Col
              xs={6}
              sm={5}
              md={5}
              className="mt-2 pr-0 pl-0 d-flex flex-row justify-content-center"
            >
              {authContext.activeUser === null ? (
                <Button
                  onClick={authContext.showModal}
                  className="text-capitalize"
                >
                  {t("eos_wallet")}
                </Button>
              ) : (
                <Button
                  onClick={authContext.logout}
                  className="text-capitalize"
                >
                  {t("logout")} EOS
                </Button>
              )}
            </Col>
            <Col xs={6} sm={5} md={6} className="mt-2 pl-0">
              {wallet.status !== "connected" ? (
                <Button
                  onClick={() => {
                    wallet.reset();
                    localStorage.removeItem("__WALLET_CONNECTED");
                    setEthModalShow(true);
                  }}
                  className="text-capitalize"
                >
                  {t("ethereum_wallet")}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    wallet.reset();
                    localStorage.removeItem("__WALLET_CONNECTED");
                  }}
                  className="text-capitalize"
                >
                  {t("logout")} ETH
                </Button>
              )}
            </Col>
          </StyledButtonsRow>
        </Navbar.Collapse>
      </Navbar>
      {children}
      <EthereumWalletModal
        show={ethModalShow}
        onHide={() => setEthModalShow(false)}
      />
    </Container>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
