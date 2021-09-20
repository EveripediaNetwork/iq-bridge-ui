import React, { memo } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import styled from "styled-components";
import PropTypes from "prop-types";

import GlobalStyle from "../components/globalStyles";

const LoadingContainer = styled(Container)`
  ${({ cover }) =>
    cover
      ? `
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 80%;
        background-color: white;
        border-radius: 3px;
      `
      : ""}
`;

const StyledCol = styled(Col)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Loading = ({ cover }) => (
  <LoadingContainer fluid cover={cover.toString()}>
    <GlobalStyle />
    <Row>
      <StyledCol className="text-center">
        <Spinner animation="grow" variant="primary" />
      </StyledCol>
    </Row>
  </LoadingContainer>
);

Loading.propTypes = {
  cover: PropTypes.bool
};

Loading.defaultProps = {
  cover: false
};

export default memo(Loading);
