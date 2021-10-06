import React, { memo, useContext, useState, lazy } from "react";
import { Card, Button, ListGroup, ListGroupItem } from "react-bootstrap";
import styled from "styled-components";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { GaugesContext } from "../../context/gaugesContext";

const GaugesList = lazy(() => import("./gaugesList"));

const StyledCard = styled(Card)`
  padding: 10px;
  margin: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

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

const GaugesVoting = () => {
  const { gauges } = useContext(GaugesContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const [weight, setWeight] = useState(0);

  return (
    <StyledCard style={{ width: 300, height: "auto" }}>
      <Card.Title>Voting</Card.Title>
      <Card.Body className="p-0 w-100 d-flex flex-column justify-content-center">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <p className="text-center font-weight-bold mb-1">Vote weight used</p>
          <StyledListGroup
            variant="flush"
            className="d-flex flex-column justify-content-center"
          >
            {gauges &&
              gauges.map((item, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <StyledListGroupItem key={idx + 1} className="monospace">
                  {item.name}: {item.weight}%
                </StyledListGroupItem>
              ))}
          </StyledListGroup>

          <Button variant="danger" size="sm">
            Reset
          </Button>
        </div>
        <GaugesList
          activeIndex={activeIndex}
          setActiveIndex={activeIdx => setActiveIndex(activeIdx)}
        />
        <div className="d-flex flex-column text-center justify-content-center">
          <h5>Weight</h5>
          <div className="d-flex flex-row justify-content-between pl-3 pr-3">
            <Slider
              trackStyle={{ height: 14 }}
              railStyle={{ backgroundColor: "lightgray", height: 11 }}
              handleStyle={{
                borderColor: "black",
                height: 22,
                width: 22
              }}
              onChange={setWeight}
              min={0}
              max={100}
            />
            <span className="font-weight-bold ml-3">{weight}%</span>
          </div>
        </div>
        <div className="container text-center mt-3">
          <Button variant="primary" className="text-uppercase" size="sm">
            <strong>Submit Vote</strong>
          </Button>
        </div>
      </Card.Body>
    </StyledCard>
  );
};

export default memo(GaugesVoting);
