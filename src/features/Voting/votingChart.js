import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Pie } from "react-chartjs-2";

const VotingChart = ({ choices, votes }) => {
  const [votesCount, setVotesCount] = useState([]);
  const [colors, setColors] = useState([]);
  const [borderColors, setBorderColors] = useState([]);

  const getRandomRGBColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b}, 0.6)`;
  };

  useEffect(() => {
    setVotesCount([]);
    for (let i = 1; i <= choices.length; i += 1) {
      setVotesCount(prev => [
        ...prev,
        votes.filter(v => v.choice === i).length
      ]);
      setColors(prev => [getRandomRGBColor(), ...prev]);
      setBorderColors(prev => [getRandomRGBColor(), ...prev]);
    }
  }, [votes]);

  const data = {
    labels: choices,
    datasets: [
      {
        label: "# of Votes",
        data: votesCount,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="d-flex justify-content-center mt-2 mb-2">
      <Pie style={{ maxHeight: 300 }} data={data} />
    </div>
  );
};

VotingChart.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  votes: PropTypes.arrayOf(PropTypes.object).isRequired // eslint-disable-line react/forbid-prop-types
};

export default memo(VotingChart);