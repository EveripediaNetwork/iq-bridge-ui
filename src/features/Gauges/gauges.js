import React, { memo, useRef, createRef, useState } from "react";
import {
  Card,
  ProgressBar,
  Overlay,
  Tooltip,
  Button,
  Tabs,
  Tab,
  ListGroup,
  ListGroupItem
} from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import { Check } from "react-bootstrap-icons";
import styled from "styled-components";
import Select from "react-select";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import Layout from "../../components/layouts/layout";
import GaugesVotesBreakdownDialog from "../../components/ui/gaugesVotesBreakdownDialog";

const StyledCard = styled(Card)`
  padding: 10px;
  margin: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledButton = styled(Button)`
  box-shadow: 2px 3px 0px 0px rgba(0, 0, 0, 0.26);
  border-radius: 5px !important;
`;

const StyledListGroup = styled(ListGroup)`
  height: 180px !important;
  border-radius: 5px !important;
  max-height: 180px !important;
`;

const StyledListGroupItem = styled(ListGroupItem)`
  padding: 8px !important;

  &.active {
    background-color: white !important;
    color: black !important;
  }
`;

const StyledCheckIcon = styled(Check)`
  color: #28a745;
  width: 30px;
  height: 30px;
`;

const data = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)"
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)"
      ],
      borderWidth: 1
    }
  ]
};

const Gauges = () => {
  const elementsRef = useRef([1, 2, 3, 4, 5].map(() => createRef()));
  const [show, setShow] = useState([1, 2, 3, 4, 5].map(() => false));
  const [showVotesBreakdown, setShowVotesBreakdown] = useState(false);
  const [keyTab, setKeyTab] = useState("last-week");
  const [weight, setWeight] = useState(0);
  const [gauges] = useState([
    "polygon-hiiq",
    "usdc-hiiq",
    "iq-editing-rewards"
  ]);
  const [activeIndex, setActiveIndex] = useState(0);

  const getRandomRGBColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
  };

  const options = [
    { value: "polygon-hiiq", label: "polygon-hiiq" },
    { value: "usdc-hiiq", label: "frax-iq" },
    { value: "iq-editing-rewards", label: "iq-editing-rewards" }
  ];

  const TabBody = () => (
    <>
      <Select placeholder="Select a gauge" options={options} className="mt-3" />
      <hr />
      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center">
        <StyledButton variant="success mb-2" size="sm">
          My votes
        </StyledButton>
        <h5>Voted this week</h5>
        <span className="monospace">549,345,433 IQ</span>
        <span>
          <span className="monospace font-weight-bold">34%</span> of HiIQ supply
          voted
        </span>

        <StyledButton
          onClick={() => setShowVotesBreakdown(!showVotesBreakdown)}
          variant="info"
          className="mt-2"
          size="sm"
        >
          <strong>Breakdown</strong>
        </StyledButton>
      </div>
    </>
  );

  return (
    <Layout>
      <div className="d-flex flex-row flex-wrap justify-content-center h-75 align-items-center">
        <StyledCard style={{ width: 277 }}>
          <Card.Title>Weight distribution</Card.Title>
          <Card.Body>
            <Doughnut data={data} style={{ width: 277 }} />
          </Card.Body>
        </StyledCard>
        <StyledCard style={{ width: 300, height: 400 }}>
          <Card.Title>Voting</Card.Title>
          <Card.Body className="p-0 w-100 d-flex flex-column justify-content-center">
            <p className="text-left mb-1">
              Vote weight: <strong>56%</strong>
            </p>
            <div className="d-flex flex-column justify-content-center align-items-center">
              <p className="text-center font-weight-bold mb-1">% used</p>
              <ProgressBar
                style={{ borderRadius: 5, width: "100%", marginBottom: 5 }}
              >
                {[0, 1, 2, 3, 4].map(item => (
                  <>
                    <ProgressBar
                      key={item}
                      ref={elementsRef.current[item]}
                      onClick={() => {
                        console.log("hey");
                        const aux = show;
                        aux[item] = !aux[item];
                        console.log(aux);
                        setShow(aux);
                      }}
                      style={{
                        backgroundColor: getRandomRGBColor(),
                        width: "100%",
                        borderRadius: 0
                      }}
                    />
                    <Overlay
                      target={elementsRef.current[item]}
                      show={show[item]}
                      placement="bottom"
                    >
                      {props => <Tooltip {...props}>iq/frax pool</Tooltip>}
                    </Overlay>
                  </>
                ))}
              </ProgressBar>

              <Button variant="danger" size="sm">
                Reset
              </Button>
            </div>
            <StyledListGroup className="d-flex flex-column justify-content-center">
              {gauges.map((g, index) => (
                <StyledListGroupItem
                  onClick={() => setActiveIndex(index)}
                  className="d-flex flex-row justify-content-between"
                  action
                  href={`#link${index}`}
                >
                  {g}
                  {index === activeIndex ? <StyledCheckIcon /> : null}
                </StyledListGroupItem>
              ))}
            </StyledListGroup>
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
            <div className="container text-center mt-3">
              <Button variant="primary" className="text-uppercase" size="sm">
                <strong>Submit Vote</strong>
              </Button>
            </div>
          </Card.Body>
        </StyledCard>
        <StyledCard style={{ width: 330 }}>
          <Card.Title>Voting history</Card.Title>
          <Card.Body className="p-0 w-100">
            <Tabs activeKey={keyTab} onSelect={k => setKeyTab(k)}>
              <Tab
                eventKey="last-week"
                title="Last week"
                onClick={event => event.preventDefault()}
              >
                {TabBody()}
              </Tab>
              <Tab
                eventKey="this-week"
                title="This week"
                onClick={event => event.preventDefault()}
              >
                {TabBody()}
              </Tab>
            </Tabs>
          </Card.Body>
        </StyledCard>
      </div>
      <GaugesVotesBreakdownDialog
        show={showVotesBreakdown}
        setShow={setShowVotesBreakdown}
      />
    </Layout>
  );
};

export default memo(Gauges);
