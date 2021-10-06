import React, { memo, useContext } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Check } from "react-bootstrap-icons";
import styled from "styled-components";
import PropTypes from "prop-types";

import { GaugesContext } from "../../context/gaugesContext";

const StyledListGroup = styled(ListGroup)`
  height: 180px !important;
  border-radius: 5px !important;
  max-height: 180px !important;
  width: 100%;
  margin: auto;
  overflow-y: auto;
`;

const StyledListGroupItem = styled(ListGroupItem)`
  padding: 5px !important;
  max-height: 40px !important;

  &.active {
    background-color: #d1e6ef !important;
    max-height: 40px !important;

    color: black !important;
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
      className="d-flex flex-column justify-content-center"
    >
      {gauges &&
        gauges.map((g, index) => (
          <StyledListGroupItem
            key={g.name}
            onClick={() => setActiveIndex(index)}
            className={`d-flex flex-row justify-content-between monospace ${
              activeIndex === index ? "shadow-sm active" : ""
            }`}
            action
            href={`#link${index}`}
          >
            {g.name}
            {index === activeIndex ? <StyledCheckIcon /> : null}
          </StyledListGroupItem>
        ))}
    </StyledListGroup>
  );
};

GaugesList.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  setActiveIndex: PropTypes.func.isRequired
};

export default memo(GaugesList);
