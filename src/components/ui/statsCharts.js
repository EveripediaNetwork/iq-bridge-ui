import React, { memo, useState, useEffect } from "react";
import styled from "styled-components";
import { Bar, Doughnut } from "react-chartjs-2";
import { Card } from "react-bootstrap";
import { groupBy, sortBy, take } from "lodash";

import {
  getLockBreakdown,
  getUserBalances
} from "../../utils/StatsDataProvider";
import { ethBasedExplorerUrl } from "../../config";

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: false
        }
      }
    ]
  }
};

const StyledContainer = styled.div`
  max-width: 450;
  overflow-x: auto;
`;

const StyledCard = styled(Card)`
  border-radius: 15px !important;
  border: 0.5px dashed lightgray !important;
`;

const StatsCharts = () => {
  const [lockBreakdownChartData, setLockBreakdownChartData] = useState();
  const [volumeChartData, setVolumeChartData] = useState();
  const [addresses, setAddresses] = useState([]);

  const configureLockBreakdownChart = data => {
    setLockBreakdownChartData({
      labels: Object.keys(data),
      datasets: [
        {
          label: "Lock breakdown",
          data: Object.values(data),
          backgroundColor: Object.keys(data).map(() => "rgba(23,162,184,1)"),
          borderColor: Object.keys(data).map(() => "rgba(23,162,184,1)"),
          borderWidth: 1
        }
      ]
    });
  };

  const getRandomRGBColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b}, 0.6)`;
  };

  const configureTopHoldersChart = data => {
    setAddresses(Object.keys(data));
    setVolumeChartData({
      labels: Object.keys(data).map(
        d => `${d.substring(1, 5)}...${d.substring(d.length - 1, d.length - 5)}`
      ),
      datasets: [
        {
          label: "Volume",
          data: Object.values(data).map(v => Number(v[0].totalIQLocked)),
          backgroundColor: Object.values(data).map(() => getRandomRGBColor()),
          borderColor: Object.values(data).map(() => getRandomRGBColor()),
          borderWidth: 1
        }
      ]
    });
  };

  const handleOnDoughnutItemClick = index => {
    if (index !== undefined)
      return window
        .open(`${ethBasedExplorerUrl}address/${addresses[index]}`, "_blank")
        ?.focus();

    return null;
  };

  useEffect(() => {
    (async () => {
      const { data } = await getLockBreakdown();

      const buckets = data.map(l => ({ [l.bucket]: l.totalIQLocked }));
      let aux = {};
      // eslint-disable-next-line array-callback-return
      buckets.map(b => {
        aux = { ...aux, ...b };
      });

      delete aux.Unlocked;

      configureLockBreakdownChart(aux);

      let userBalances = await getUserBalances();

      userBalances = take(
        sortBy(userBalances.data, v => Number(v.totalIQLocked)).reverse(),
        10
      );

      configureTopHoldersChart(groupBy(userBalances, "address"));
    })();
  }, []);

  return (
    <StyledContainer>
      <StyledCard className="p-2 mb-2">
        <Bar data={lockBreakdownChartData} options={options} />
      </StyledCard>
      <StyledCard className="p-2 mb-2 text-center">
        <h5>Top 10 stakers</h5>
        <Doughnut
          getElementAtEvent={el => {
            handleOnDoughnutItemClick(el && el[0] ? el[0].index : undefined);
          }}
          data={volumeChartData}
        />
      </StyledCard>
    </StyledContainer>
  );
};

StatsCharts.propTypes = {};

export default memo(StatsCharts);
