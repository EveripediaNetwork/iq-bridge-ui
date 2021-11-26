import React from "react";
import { fadeInRight } from "react-animations";
import styled, { keyframes } from "styled-components";
import { BoxArrowUpRight } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

import { ethBasedExplorerUrl } from "../../config";

const fadeInRightAnimation = keyframes`${fadeInRight}`;

const StyledButton = styled(Button)`
  animation: 1s ${fadeInRightAnimation};
`;

const ViewInExplorerBtn = ({ hide, txHash }) => {
  const { t } = useTranslation();

  return (
    <StyledButton
      size="sm"
      variant="link"
      className="ml-2 shadow-sm"
      onClick={() => {
        setTimeout(() => {
          hide();
        }, 10000);
      }}
    >
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`${ethBasedExplorerUrl}tx/${txHash}`}
      >
        {t("view_details")}
        <BoxArrowUpRight className="ml-2" />
      </a>
    </StyledButton>
  );
};

ViewInExplorerBtn.propTypes = {
  hide: PropTypes.func.isRequired,
  txHash: PropTypes.func.isRequired
};

export default ViewInExplorerBtn;
