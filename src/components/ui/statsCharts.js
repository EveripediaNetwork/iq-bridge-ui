import React, { memo, useState, useEffect } from "react";
import styled from "styled-components";
import { Bar } from "react-chartjs-2";
import { Card } from "react-bootstrap";
import { groupBy } from "lodash";

import {
  getLockBreakdown,
  getUserBalances
} from "../../utils/StatsDataProvider";

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true
        }
      }
    ]
  }
};

const lineChartOptions = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true
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
  border-radius: 3px !important;
`;

const StatsCharts = () => {
  const [lockBreakdownChartData, setLockBreakdownChartData] = useState();
  const [volumeChartData, setVolumeChartData] = useState();

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

  const configureVolumeChart = data => {
    setVolumeChartData({
      labels: data.map(d => d.date.toString()),
      datasets: [
        {
          label: "Volume",
          data: data.map(d => d.locking_volume + d.unlocking_volume),
          backgroundColor: data.map(d =>
            d.locking_volume > d.unlocking_volume
              ? "rgba(40, 201, 83, 1)"
              : "rgba(201, 45, 40, 1)"
          ),
          borderColor: data.map(d =>
            d.locking_volume > d.unlocking_volume
              ? "rgba(40, 201, 83, 1)"
              : "rgba(201, 45, 40, 1)"
          ),
          borderWidth: 1
        }
      ]
    });
  };

  useEffect(() => {
    (async () => {
      const { data } = await getLockBreakdown();

      console.log(data);
      let buckets = data.map(l => ({ [l.bucket]: l.totalUserCount }));
      let aux = {};
      buckets = buckets.map(b => {
        aux = { ...aux, ...b };
      });

      configureLockBreakdownChart(aux);

      const userBalances = await getUserBalances();

      console.log(groupBy(userBalances.data, "address"));
    })();

    const d = new Date();
    const date = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;

    configureVolumeChart([
      {
        date,
        locking_volume: 10000000,
        unlocking_volume: 7500000
      },
      {
        date,
        locking_volume: 1000000,
        unlocking_volume: 5000000
      },
      {
        date,
        locking_volume: 2300000,
        unlocking_volume: 4567000
      },
      {
        date,
        locking_volume: 8902300,
        unlocking_volume: 5324768
      },
      {
        date,
        locking_volume: 9875423,
        unlocking_volume: 15000000
      },
      {
        date,
        locking_volume: 500000,
        unlocking_volume: 200000
      },
      {
        date,
        locking_volume: 876934,
        unlocking_volume: 0
      },
      {
        date,
        locking_volume: 25000000,
        unlocking_volume: 345987
      },
      {
        date,
        locking_volume: 6700000,
        unlocking_volume: 12000000
      },
      {
        date,
        locking_volume: 1123000,
        unlocking_volume: 14000000
      },
      {
        date,
        locking_volume: 0,
        unlocking_volume: 0
      },
      {
        date,
        locking_volume: 2300000,
        unlocking_volume: 400000
      }
    ]);
  }, []);

  return (
    <StyledContainer>
      <StyledCard className="p-2 shadow-sm mb-2">
        <Bar data={lockBreakdownChartData} options={options} />
      </StyledCard>
      <StyledCard className="p-2 shadow-sm mb-2">
        <Bar data={volumeChartData} options={lineChartOptions} />
      </StyledCard>
    </StyledContainer>
  );
};

StatsCharts.propTypes = {};

export default memo(StatsCharts);
