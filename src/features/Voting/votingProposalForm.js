import React, { memo } from "react";
import PropTypes from "prop-types";
import { Button, Form } from "react-bootstrap";

// eslint-disable-next-line no-unused-vars
const VotingProposalForm = ({ proposal = null, onTxDone }) => {
  if (proposal === null) {
    return <>Loading...</>;
  }
  return (
    <Form>
      <Button
        variant="primary"
        className="text-capitalize"
        type="submit"
        size="lg"
        block
      >
        option 1
      </Button>
    </Form>
  );
};

VotingProposalForm.propTypes = {
  onTxDone: PropTypes.func.isRequired,
  proposal: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

export default memo(VotingProposalForm);
