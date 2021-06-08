import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getProposals } from "../../utils/SnapshotProvider";

// eslint-disable-next-line no-unused-vars
const VotingSelector = ({ onSelect }) => {
  const [proposals, setProposals] = useState([]);
  // TODO: default to latest proposal, on select change content in parent
  useEffect(() => {
    (async () => {
      setProposals(await getProposals());
    })();
  }, [setProposals]);

  return (
    <select>
      {proposals.map(item => (
        <option key={item.id}>{item.name}</option>
      ))}
    </select>
  );
};

VotingSelector.propTypes = {
  onSelect: PropTypes.func.isRequired
};

export default memo(VotingSelector);
