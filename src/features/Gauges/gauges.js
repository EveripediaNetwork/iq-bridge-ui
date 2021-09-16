import React, { memo, useRef, createRef, useState } from "react";
import {
  Card,
  ProgressBar,
  Overlay,
  Tooltip,
  Button,
  Tab
} from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import styled from "styled-components";
import Select from "react-select";

import Layout from "../../components/layouts/layout";

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

  const getRandomRGBColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
  };

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" }
  ];

  return (
    <Layout>
      <div className="d-flex flex-row flex-wrap justify-content-center h-100 align-items-center">
        <StyledCard style={{ width: 200 }}>
          <Card.Title>Voting</Card.Title>
          <Card.Body className="p-0 w-100">
            <p className="text-left mb-1">
              Vote weight: <strong>56%</strong>
            </p>
            <hr />
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

              <StyledButton variant="danger" size="sm">
                Reset
              </StyledButton>
            </div>
            <hr />
            <Select
              placeholder="Select a gauge"
              options={options}
              className="mt-3"
            />
            <div className="container text-center mt-3">
              <StyledButton
                variant="light"
                className="text-uppercase"
                size="sm"
              >
                <strong>Submit Vote</strong>
              </StyledButton>
            </div>
          </Card.Body>
        </StyledCard>
        <StyledCard style={{ width: 360 }}>
          <Card.Title>Weight distribution</Card.Title>
          <Card.Body>
            <Doughnut data={data} />
          </Card.Body>
        </StyledCard>
        <StyledCard style={{ width: 200 }}>
          <Card.Title>Voting history</Card.Title>
          <Card.Body></Card.Body>
        </StyledCard>
      </div>
    </Layout>
  );
};

export default memo(Gauges);
