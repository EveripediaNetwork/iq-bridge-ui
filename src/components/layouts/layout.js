import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
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
            🌉
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link
              active={location.pathname === "/"}
              as={Link}
              to={`/${LngUrl}`}
            >
              {t("EOS")}
            </Nav.Link>
            <Nav.Link
              active={location.pathname === "/eth"}
              as={Link}
              to={`/eth${LngUrl}`}
            >
              {t("ETH")}
            </Nav.Link>
          </Nav>
          <LanguageSelector />
          <Form inline>
            {authContext.activeUser === null ? (
              <Button
                onClick={authContext.showModal}
                className="text-capitalize"
              >
                EOS Wallet
              </Button>
            ) : (
              <Button onClick={authContext.logout} className="text-capitalize">
                {t("logout")} EOS
              </Button>
            )}
          </Form>
          <Form inline>
            {wallet.status !== "connected" ? (
              <Button
                onClick={() => {
                  setEthModalShow(true);
                }}
                className="text-capitalize ml-2"
              >
                Ethereum Wallet
              </Button>
            ) : (
              <Button
                onClick={() => {
                  wallet.reset();
                  localStorage.removeItem("__WALLET_CONNECTED");
                }}
                className="text-capitalize ml-2"
              >
                {t("logout")} ETH
              </Button>
            )}
          </Form>
        </Navbar.Collapse>
      </Navbar>
      {children}
      <EthereumWalletModal
        show={ethModalShow}
        onHide={() => {
          setEthModalShow(false);
        }}
      />
    </Container>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
