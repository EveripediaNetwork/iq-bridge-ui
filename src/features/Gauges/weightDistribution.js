import React, { memo, useContext, useState, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { fadeInRight } from "react-animations";
import styled, { keyframes } from "styled-components";

import { GaugesContext } from "../../context/gaugesContext";

const fadeInRightAnimation = keyframes`${fadeInRight}`;

const StyledCard = styled(Card)`
  width: 350px;
  height: 386px;
  border: 0.5px solid whitesmoke !important;
  padding: 10px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: 1s ${fadeInRightAnimation};
`;

const WeightDistribution = () => {
  const { t } = useTranslation();
  const { gauges } = useContext(GaugesContext);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (gauges !== undefined) {
      setLoading(true);
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
      for (let i = 0; i < gauges.length; i += 1) {
        if (Number(gauges[i].gaugeWeight) === 0) break;

        tmp.labels.unshift(gauges[i].name);
        tmp.datasets[0].data.unshift(gauges[i].gaugeWeight);
        tmp.datasets[0].backgroundColor.unshift(colors[i]);
        tmp.datasets[0].borderColor.unshift("rgba(0, 0, 0, 0.8)");
      }

      if (tmp.labels.length > 0) setData(tmp);

      setLoading(false);
    }
  }, [gauges]);

  return (
    <>
      {data !== undefined ? (
        <StyledCard>
          <Card.Title>{t("weight_distribution")}</Card.Title>
          <Card.Body className="w-100">
            {" "}
            {!loading ? (
              <Doughnut data={data} style={{ width: 277 }} />
            ) : (
              <div className="container h-100 d-flex flex-column justify-content-center align-items-center">
                <Spinner animation="grow" variant="primary" />
              </div>
            )}
          </Card.Body>
        </StyledCard>
      ) : null}
    </>
  );
};

export default memo(WeightDistribution);
