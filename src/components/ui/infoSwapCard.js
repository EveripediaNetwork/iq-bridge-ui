import React from "react";
import styled from "styled-components";
import { Card } from "react-bootstrap";
import PropTypes from "prop-types";

const SubCard = styled(Card)`
  max-width: 400px;
  z-index: -1;
  top: -22px;
  margin-top: 12px;
  border-radius: 0 !important;

  .card-body {
    padding: 0.35rem !important;
  }
`;

const StyledDivider = styled.hr`
  margin-top: 2px;
  margin-bottom: 2px;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const SwapInfo = styled.div`
  .infoLine {
    display: grid;
    grid-template-columns: 200px auto;
    justify-content: space-between;
    font-size: 14px;
    color: #aeabab;
    margin: 8px;
  }
  .warning {
    color: red;
  }
  .safe {
    color: #aeabab;
  }
`;

const InfoSwapCard = ({
  timeLockedDescription,
  balanceDescription,
  timeLocked,
  tokensLocked
}) => {
  return (
    <SubCard className="mx-auto shadow-sm rounded-bottom">
      <Card.Body>
        <SwapInfo>
          <div className="infoLine">
            <div>{timeLockedDescription}</div>
            <div className="font-weight-bold">{timeLocked}</div>
          </div>
          <StyledDivider />
          <div className="infoLine">
            <div>{balanceDescription}</div>
            <div>
              <strong>
                {Number(
                  tokensLocked + (tokensLocked * 3 * timeLocked) / 1460
                ).toFixed(2)}
              </strong>{" "}
              hiIQ
            </div>
          </div>
        </SwapInfo>
      </Card.Body>
    </SubCard>
  );
};

InfoSwapCard.propTypes = {
  timeLockedDescription: PropTypes.string.isRequired,
  balanceDescription: PropTypes.string.isRequired,
  timeLocked: PropTypes.number.isRequired,
  tokensLocked: PropTypes.number.isRequired
};

export default InfoSwapCard;
