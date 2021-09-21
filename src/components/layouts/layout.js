import React, { useContext, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, Row, Col, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useWallet } from "use-wallet";
import Jazzicon from "@metamask/jazzicon";

import { WallerProviderContext as UALContext } from "../../context/walletProvider/walletProviderFacade";
import { TransactionContext } from "../../context/transactionContext";
import GlobalStyle from "../globalStyles";
import LanguageSelector from "./LanguageMenu/LanguageSelector";
import EthereumWalletModal from "../ui/ethereumWalletModal";
import WrongChainModal from "../ui/wrongChainModal";
import InfoAlert from "../ui/infoAlert";
import AccountDetailsDialog from "../ui/accountDetailsDialog";

const isWalletConnected = () => {
  const val = localStorage.getItem("__WALLET_CONNECTED");

  return val ? JSON.parse(val) : null;
};

const StyledButtonsRow = styled(Row)`
  min-width: 350px;
`;

const StyledNavbar = styled(Navbar)`
  background-color: black;
  font-size: 14px;
  font-weight: 600;
`;

const StyledNavLink = styled(Nav.Link)`
  color: white !important;
  display: block;
  padding: 0.5rem 1rem;
  border-right: 1px solid rgb(58, 58, 58);
  :hover {
    color: grey !important;
    text-decoration: none;
  }
`;

const SwapTokenIcon = styled.img`
  width: 30px;
`;

const StyledIdenticonContainer = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 2.125rem;
  background-color: transparent;
`;

const Layout = ({ children }) => {
  const location = useLocation();
  const authContext = useContext(UALContext);
  const ref = useRef();
  const { txDone } = useContext(TransactionContext);
  const { t, i18n } = useTranslation();
  const LngUrl = `?lng=${i18n.language}`;
  const [ethModalShow, setEthModalShow] = useState(false);
  const [openAccountDetails, setOpenAccountDetails] = useState(false);
  const connectedId = isWalletConnected();
  const wallet = useWallet();

  if (wallet.status === "disconnected" && connectedId != null) {
    wallet.connect(connectedId);
  }

  const IdentIcon = () => <StyledIdenticonContainer ref={ref} />;

  useEffect(() => {
    if (wallet.account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(
        Jazzicon(16, parseInt(wallet.account.slice(2, 10), 16))
      );
    }
  }, [wallet]);

  return (
    <div>
      <GlobalStyle />
      <StyledNavbar expand="lg" variant="dark">
        <Navbar.Brand as={Link} to={`/${LngUrl}`}>
          <SwapTokenIcon src={`${window.location.origin}/tokens/iq.png`} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <NavDropdown
              active={
                location.pathname === "/" ||
                location.pathname === "/eth" ||
                location.pathname === "/reverseEth"
              }
              title="Bridge"
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
            <StyledNavLink
              active={location.pathname === "/lock"}
              as={Link}
              to={`/lock${LngUrl}`}
            >
              {t("lock")}
            </StyledNavLink>
            <StyledNavLink
              active={location.pathname === "/voting"}
              as={Link}
              to={`/voting${LngUrl}`}
            >
              {t("voting")}
            </StyledNavLink>
            <StyledNavLink
              active={location.pathname === "/stats"}
              as={Link}
              to={`/stats${LngUrl}`}
            >
              {t("stats")}
            </StyledNavLink>
            <StyledNavLink href="https://learn.everipedia.org/">
              {t("Learn")}
            </StyledNavLink>
          </Nav>
          <LanguageSelector className="pr-4" />
          <StyledButtonsRow xs={6} sm={6} md={6}>
            <Col
              xs={6}
              sm={6}
              md={6}
              className="mt-1 pr-0 pl-0 d-flex flex-row justify-content-center"
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
            <Col xs={6} sm={6} md={6} className="mt-1 pl-0">
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
                <>
                  {wallet.account && (
                    <>
                      <Button
                        variant="dark"
                        onClick={() => setOpenAccountDetails(true)}
                        className="d-flex flex-row justify-content-center"
                      >
                        {IdentIcon()}
                        <span className="ml-2">
                          {`${wallet.account.match(/.{1,10}/g)[0]}...`}
                        </span>
                      </Button>
                    </>
                  )}
                </>
              )}
            </Col>
          </StyledButtonsRow>
        </Navbar.Collapse>
      </StyledNavbar>
      {children}
      {wallet.account && txDone && (
        <Row>
          <Col>
            <InfoAlert text={t("tx_executed")} />
          </Col>
        </Row>
      )}
      <AccountDetailsDialog
        openAccountDetails={openAccountDetails}
        setOpenAccountDetails={setOpenAccountDetails}
      />
      <WrongChainModal />
      <EthereumWalletModal show={ethModalShow} setShow={setEthModalShow} />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
