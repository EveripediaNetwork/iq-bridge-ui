import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

import ProposalsModal from "../../components/ui/proposalsModal";

// eslint-disable-next-line no-unused-vars
const VotingSelector = ({ onSelect }) => {
  const [openProposalsModal, setOpenProposalsModal] = useState(false);

  const handleSelectProposalClick = () => {
    setOpenProposalsModal(true);
  };

  return (
    <div className="d-flex flex-column justify-content center">
      <div className="text-center">
        <Button variant="light" onClick={handleSelectProposalClick}>
          Select a proposal
        </Button>
      </div>

      <ProposalsModal
        onHide={() => setOpenProposalsModal(false)}
        show={openProposalsModal}
      />
    </div>
  );
};

VotingSelector.propTypes = {
  onSelect: PropTypes.func.isRequired
};

export default memo(VotingSelector);
