import React, { memo, useContext } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Check } from "react-bootstrap-icons";
import styled from "styled-components";
import PropTypes from "prop-types";
import DateCountdown from "react-date-countdown-timer";

import { GaugesContext } from "../../context/gaugesContext";

const StyledListGroup = styled(ListGroup)`
  height: 300px !important;
  border-radius: 5px !important;
  // max-height: 180px !important;
  width: 100%;
  margin: auto;
  overflow-y: auto;
`;

const StyledListGroupItem = styled(ListGroupItem)`
  padding: 5px !important;
  //max-height: 40px !important;
  flex-wrap: wrap;

  &.active {
    background-color: #d1e6ef !important;
    // max-height: 40px !important;

    color: black !important;
  }

  .odometer-block {
    font-size: 12px !important;
  }
`;

const StyledCheckIcon = styled(Check)`
  color: darkgreen;
  width: 30px;
  height: 30px;
`;

const GaugesList = ({ activeIndex, setActiveIndex }) => {
  const { gauges } = useContext(GaugesContext);

  return (
    <StyledListGroup
      defaultActiveKey="link#1"
      className="d-flex flex-column justify-content-center shadow-sm mt-3 mb-3"
    >
      {gauges &&
        gauges.map((g, index) => (
          <>
            <StyledListGroupItem
              key={g.name}
              onClick={() => setActiveIndex(index)}
              className={`d-flex flex-column justify-content-center monospace ${
                activeIndex === index ? "shadow-sm active" : ""
              }`}
              action
              href={`#link${index}`}
            >
              <div
                style={{ backgroundColor: "whitesmoke" }}
                className="d-flex flex-row justify-content-between"
              >
                <strong>{g.name}</strong>
                {index === activeIndex ? <StyledCheckIcon /> : null}
              </div>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <u>Weight</u>
                <span>{g.gaugeWeight}</span>
              </div>
              {g.nextVotingDate &&
                g.blockTime &&
                g.blockTime < g.nextVotingDate && (
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <u>Time to revote: </u>
                    <DateCountdown
                      mostSignificantFigure="day"
                      dateTo={g.nextVotingDate}
                      dateFrom={g.blockTime}
                      noAnimate
                    />
                  </div>
                )}
            </StyledListGroupItem>
          </>
        ))}
    </StyledListGroup>
  );
};

GaugesList.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  setActiveIndex: PropTypes.func.isRequired
};

export default memo(GaugesList);
