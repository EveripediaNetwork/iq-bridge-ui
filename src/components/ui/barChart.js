import React, { memo, useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";

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

const lineChartRawData = {
  labels: ["1", "2", "3", "4", "5", "6"],
  datasets: [
    {
      label: "hiIQ volume",
      data: [12, 19, 3, 5, 2, 3],
      fill: false,
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgba(255, 99, 132, 0.2)"
    }
  ]
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

const BarChart = () => {
  const [lockBreakdownChartData, setLockBreakdownChartData] = useState();

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

  useEffect(() => {
    configureLockBreakdownChart({
      "<= 15 days": 10,
      "15 - 30 days": 60,
      "60 - 90 days": 19,
      "1 - 2 years": 56,
      "2 - 3 years": 44,
      "3 - 4 years": 102
    });
  }, []);

  return (
    <>
      <Bar data={lockBreakdownChartData} options={options} />
      <Line data={lineChartRawData} options={lineChartOptions} />
    </>
  );
};

BarChart.propTypes = {};

export default memo(BarChart);
