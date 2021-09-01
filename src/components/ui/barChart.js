import React, { memo } from "react";
import { Bar, Line } from "react-chartjs-2";

const data = {
  labels: [
    "<= 15 days",
    "15 - 30 days",
    "60 - 90 days",
    "1 - 2 years",
    "2 - 3 years",
    "3 - 4 years"
  ],
  datasets: [
    {
      label: "Lock Breakdown",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(23,162,184,1)",
        "rgba(23,162,184,1)",
        "rgba(23,162,184,1)",
        "rgba(23,162,184,1)",
        "rgba(23,162,184,1)",
        "rgba(23,162,184,1)"
      ],
      borderColor: [
        "rgba(23,162,184,1)",
        "rgba(23,162,184,1)",
        "rgba(23,162,184,1)",
        "rgba(23,162,184,1)",
        "rgba(23,162,184,1)",
        "rgba(23,162,184,1)"
      ],
      borderWidth: 1
    }
  ]
};

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
      label: "hiIQ supply",
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
  return (
    <>
      <Bar data={data} options={options} />
      <Line data={lineChartRawData} options={lineChartOptions} />
    </>
  );
};

BarChart.propTypes = {};

export default memo(BarChart);
