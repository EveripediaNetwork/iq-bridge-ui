import React, { memo, useContext, useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import styled from "styled-components";
import { GaugesContext } from "../../context/gaugesContext";

const StyledCard = styled(Card)`
  padding: 10px;
  margin: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const WeightDistribution = () => {
  const { gauges } = useContext(GaugesContext);
  const [data, setData] = useState();

  useEffect(() => {
    if (gauges !== undefined) {
      const tmp = {
        labels: [],
        datasets: [
          {
            label: "",
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
          }
        ]
      };
      const colors = ["rgba(255, 99, 132, 0.2)", "rgba(209, 230, 239, 0.8)"];
      for (let i = 0; i < gauges.length; i++) {
        tmp.labels.unshift(gauges[i].name);
        tmp.datasets[0].data.unshift(gauges[i].gaugeWeight);
        tmp.datasets[0].backgroundColor.unshift(colors[i]);
        tmp.datasets[0].borderColor.unshift("rgba(0, 0, 0, 0.8)");
      }

      setData(tmp);
    }
  }, [gauges]);

  return (
    <StyledCard style={{ width: 350 }}>
      <Card.Title>Weight distribution</Card.Title>
      <Card.Body className="w-100">
        {" "}
        {data !== undefined && <Doughnut data={data} style={{ width: 277 }} />}
      </Card.Body>
    </StyledCard>
  );
};

export default memo(WeightDistribution);
