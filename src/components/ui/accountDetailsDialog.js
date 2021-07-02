import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useWallet } from "use-wallet";
import { Button, ListGroup } from "react-bootstrap";
import { BoxArrowUpRight, Clipboard } from "react-bootstrap-icons";

import GenericDialog from "./genericDialog";
import { TransactionContext } from "../../context/transactionContext";

const StyledSpan = styled.span`
  font-size: 12px;
`;

const AccountDetailsDiv = styled.div`
  border-radius: 10px;
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
  const { hashes } = useContext(TransactionContext);

  return (
    <GenericDialog
      size="sm"
      title="Account"
      show={openAccountDetails}
      onHide={() => setOpenAccountDetails(false)}
      body={
        <div className="p-0">
          <AccountDetailsDiv className="p-0 shadow-sm d-flex flex-column justify-content-center">
            {wallet.account && (
              <span className="ml-2 text-center">
                {`${wallet.account.match(/.{1,24}/g)[0]}...`}
              </span>
            )}
            <br />
            <div className="d-flex flex-row justify-content-center">
              <Button className="p-0 mr-1" variant="link">
                <Clipboard />
                <StyledSpan className="ml-1">Copy Address</StyledSpan>
              </Button>
              <Button className="p-0 ml-1" variant="link">
                <BoxArrowUpRight />
                <StyledSpan className="ml-1">View on Block Explorer</StyledSpan>
              </Button>
            </div>
            <AccountDetailsFooter className="shadow mt-2 p-2">
              {hashes && hashes.length > 0 ? (
                <ListGroup className="bg-transparent" variant="flush">
                  {hashes.map(h => (
                    <ListGroup.Item
                      className="bg-transparent text-white"
                      key={h}
                    >
                      {`${h.match(/.{1,30}/g)[0]}...`}
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
