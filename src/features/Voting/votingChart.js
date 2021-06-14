import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Pie } from "react-chartjs-2";

const VotingChart = ({ choices, votes }) => {
  const [votesCount, setVotesCount] = useState([]);
  useEffect(() => {
    for (let i = 0; i < choices.length; i++)
      setVotesCount(prev => [
        votes.filter(v => v.choice === i).length,
        ...prev
      ]);
  }, []);

  const data = {
    labels: choices,
    datasets: [
      {
        label: "# of Votes",
        data: votesCount,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)"
          // "rgba(255, 206, 86, 0.2)",
          // "rgba(75, 192, 192, 0.2)",
          // "rgba(153, 102, 255, 0.2)",
          // "rgba(255, 159, 64, 0.2)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)"
          // "rgba(255, 206, 86, 1)",
          // "rgba(75, 192, 192, 1)",
          // "rgba(153, 102, 255, 1)",
          // "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  console.log(choices);

  return (
    <div className="d-flex justify-content-center mt-2 mb-2">
      <Pie style={{ maxHeight: 300 }} data={data} />
    </div>
  );
};

VotingChart.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  votes: PropTypes.arrayOf(PropTypes.number).isRequired
};

export default memo(VotingChart);
