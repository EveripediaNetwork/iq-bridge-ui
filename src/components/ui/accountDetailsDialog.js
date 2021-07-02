import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useWallet } from "use-wallet";
import { Button, ListGroup, Popover, OverlayTrigger } from "react-bootstrap";
import {
  BoxArrowUpRight,
  Clipboard,
  BoxArrowLeft
} from "react-bootstrap-icons";
import { ethBasedExplorerUrl } from "../../config";

import GenericDialog from "./genericDialog";
import { TransactionContext } from "../../context/transactionContext";

const StyledSpan = styled.span`
  font-size: 12px;
`;

const AccountDetailsDiv = styled.div`
  border-radius: 10px;
`;

const HeaderDetails = styled.div`
  border: 0.5px dashed lightgray;
`;

const AccountDetailsFooter = styled.div`
  background-color: #2c2f36;
  border-radius: 5px 5px 0px 0px;
`;

const AccountDetailsDialog = ({
  openAccountDetails,
  setOpenAccountDetails
}) => {
  const wallet = useWallet();
  const [showOverlay, setShowOverlay] = useState(false);
  const { hashes } = useContext(TransactionContext);

  const popover = props => (
    <Popover id="copied" {...props}>
      <Popover.Content>Copied to clipboard</Popover.Content>
    </Popover>
  );

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(wallet.account);
    setShowOverlay(true);

    setTimeout(() => {
      setShowOverlay(false);
    }, 4000);
  };

  const handleClickLogout = () => {
    wallet.reset();
    localStorage.removeItem("__WALLET_CONNECTED");
    setOpenAccountDetails(false);
  };

  return (
    <GenericDialog
      size="sm"
      title="Account"
      show={openAccountDetails}
      onHide={() => setOpenAccountDetails(false)}
      body={
        <div className="p-0">
          <AccountDetailsDiv className="p-0 shadow-sm d-flex flex-column justify-content-center">
            <HeaderDetails className="p-2 text-center shadow rounded">
              {wallet.account && (
                <span className="ml-2 text-center">
                  {`${wallet.account.match(/.{1,24}/g)[0]}...`}
                </span>
              )}
              <div className="d-flex flex-row justify-content-center">
                <OverlayTrigger
                  show={showOverlay}
                  trigger="click"
                  delay={{ show: 250, hide: 400 }}
                  placement="bottom"
                  overlay={popover}
                >
                  <Button
                    onClick={handleCopyAddress}
                    className="p-0 mr-1"
                    variant="link"
                  >
                    <Clipboard />
                    <StyledSpan className="ml-1">Copy Address</StyledSpan>
                  </Button>
                </OverlayTrigger>
                <Button className="p-0 ml-1" variant="link">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${ethBasedExplorerUrl}address/${wallet.account}`}
                  >
                    <BoxArrowUpRight />
                    <StyledSpan className="ml-1">
                      View on Block Explorer
                    </StyledSpan>
                  </a>
                </Button>
              </div>
              <hr />
              <div className="d-flex flex-row justify-content-center">
                <Button onClick={handleClickLogout} variant="outline-danger">
                  <BoxArrowLeft />
                  <span className="ml-1">Logout</span>
                </Button>
              </div>
            </HeaderDetails>
            <AccountDetailsFooter className="shadow mt-2 p-2">
              {hashes && hashes.length > 0 ? (
                <ListGroup className="bg-transparent" variant="flush">
                  {hashes.map(h => (
                    <ListGroup.Item className="bg-transparent" key={h}>
                      <a
                        target="_blank"
                        className="text-white"
                        rel="noopener noreferrer"
                        href={`${ethBasedExplorerUrl}tx/${h}`}
                      >
                        {`${h.match(/.{1,25}/g)[0]}...`}
                      </a>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <h6 className="text-white font-weight-light">
                  Transactions will appear here...
                </h6>
              )}
            </AccountDetailsFooter>
          </AccountDetailsDiv>
        </div>
      }
    />
  );
};

AccountDetailsDialog.propTypes = {
  openAccountDetails: PropTypes.bool.isRequired,
  setOpenAccountDetails: PropTypes.func.isRequired
};

export default AccountDetailsDialog;
