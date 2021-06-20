import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Pie } from "react-chartjs-2";

import { getScores } from "../../utils/SnapshotProvider";

const VotingChart = ({ choices, votes }) => {
  const [votesCount, setVotesCount] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [colors, setColors] = useState([]);
  const [borderColors, setBorderColors] = useState([]);

  const getRandomRGBColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b}, 0.6)`;
  };

  const data = {
    labels: choices,
    datasets: [
      {
        label: "# of Votes",
        data: votesCount,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 2
      }
    ]
  };

  const handleSetVotesCount = scores => {
    setVotesCount([]);
    for (let i = 1; i <= choices.length; i += 1) {
      const choiceCount = votes.filter(v => v.choice === i);

      const choiceVotingResult = choiceCount
        .map(c => {
          const scoreKeys = Object.keys(scores);
          const scoreValues = Object.values(scores);

          // eslint-disable-next-line eqeqeq
          const score = scoreKeys.findIndex(s => s == c.voter);
          // eslint-disable-next-line no-unused-expressions
          // eslint-disable-next-line eqeqeq
          const power = c.voter == scoreKeys[score] ? scoreValues[score] : 0;
          // eslint-disable-next-line no-param-reassign
          c.power = power;

          return power;
        })
        .reduce((a, b) => a + b, 0);

      setVotesCount(prev => [...prev, choiceVotingResult]);
      setColors(prev => [getRandomRGBColor(), ...prev]);
      setBorderColors(prev => [getRandomRGBColor(), ...prev]);
    }
  };

  useEffect(() => {
    if (addresses.length < votes.length)
      for (let i = 0; i < votes.length; i += 1)
        setAddresses(prev => [...prev, `${votes[i].voter}`]);
  }, [votes]);

  useEffect(() => {
    (async () => {
      if (addresses.length > 0) {
        const result = await getScores(addresses);
        handleSetVotesCount(result);
      }
    })();
  }, [addresses]);

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
