import React, { memo } from "react";
import PropTypes from "prop-types";

const VotingProposalContent = ({ proposal = null }) => {
  if (proposal === null) {
    return <>Loading...</>;
  }

  return (
    <>
      <div className="d-flex justify-content-center mt-2">{proposal.name}</div>
      <div className="d-flex justify-content-center mt-2">
        {proposal.content}
      </div>
      <div className="d-flex justify-content-center mt-2 mb-2">pie chart</div>
    </>
  );
};

VotingProposalContent.propTypes = {
  proposal: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

export default memo(VotingProposalContent);
