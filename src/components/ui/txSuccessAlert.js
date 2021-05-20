import { CheckSquare } from "react-bootstrap-icons";
import React from "react";
import styled from "styled-components";
import { Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const StyledAlert = styled(Alert)`
  max-width: 450px;
  margin-top: 10px;
`;

const StyledSpan = styled.span`
  margin-left: 5px;
`;

const TxSuccessAlert = ({ txId }) => {
  const explorer = `https://bloks.io/transaction/${txId}`;
  return (
    <StyledAlert className="mx-auto shadow-sm text-center" variant="success">
      <CheckSquare />
      <StyledSpan>
        <a target="_blank" rel="noopener noreferrer" href={explorer}>
          Transaction Executed
        </a>
        ! Go to <Link to="/eth">Step 2</Link>
      </StyledSpan>
    </StyledAlert>
  );
};

TxSuccessAlert.propTypes = {
  txId: PropTypes.string.isRequired
};

export default TxSuccessAlert;
