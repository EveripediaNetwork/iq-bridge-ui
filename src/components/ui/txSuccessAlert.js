import { CheckSquare } from "react-bootstrap-icons";
import React from "react";
import styled from "styled-components";
import { Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const StyledAlert = styled(Alert)`
  max-width: 450px;
  margin-top: 10px;
`;

const StyledSpan = styled.span`
  margin-left: 5px;
`;

const TxSuccessAlert = ({ txId }) => {
  const { t } = useTranslation();
  const explorer = `https://bloks.io/transaction/${txId}`;
  return (
    <StyledAlert className="mx-auto shadow-sm text-center" variant="success">
      <CheckSquare />
      <StyledSpan>
        <a target="_blank" rel="noopener noreferrer" href={explorer}>
          {t("transaction_executed")}
        </a>
        {t("go_to")} <Link to="/eth">{t("step_2")}</Link>
      </StyledSpan>
    </StyledAlert>
  );
};

TxSuccessAlert.propTypes = {
  txId: PropTypes.string.isRequired
};

export default TxSuccessAlert;
