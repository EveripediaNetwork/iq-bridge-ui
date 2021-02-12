import { InfoCircle } from "react-bootstrap-icons";
import React from "react";
import styled from "styled-components";
import { Alert } from "react-bootstrap";
import PropTypes from "prop-types";

const StyledAlert = styled(Alert)`
  max-width: 450px;
  margin-top: 10px;
`;

const StyledSpan = styled.span`
  margin-left: 5px;
`;

const InfoAlert = ({ text }) => {
  return (
    <StyledAlert className="mx-auto shadow-sm text-center" variant="info">
      <InfoCircle />
      <StyledSpan>{text}</StyledSpan>
    </StyledAlert>
  );
};

InfoAlert.propTypes = {
  text: PropTypes.string.isRequired,
};

export default InfoAlert;
