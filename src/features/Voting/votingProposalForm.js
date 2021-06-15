import React, { memo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { ButtonGroup, ToggleButton } from "react-bootstrap";

const StyledToggleButton = styled(ToggleButton)`
  max-width: fit-content;
`;

// eslint-disable-next-line no-unused-vars
const VotingProposalForm = ({ choices, setSelectedChoice }) => {
  const handleClick = event => {
    if (event.target.value) setSelectedChoice(event.target.value);
    else setSelectedChoice(undefined);
  };

  return (
    <ButtonGroup
      toggle
      onClick={handleClick}
      className="d-flex flex-row flex-wrap justify-content-center"
    >
      {choices.map(o => (
        <StyledToggleButton
          key={o}
          value={o}
          variant="light"
          type="radio"
          className="shadow m-1 rounded"
        >
          {o}
        </StyledToggleButton>
      ))}
    </ButtonGroup>
  );
};

VotingProposalForm.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.string).isRequired, // eslint-disable-line react/forbid-prop-types,
  setSelectedChoice: PropTypes.func.isRequired
};

export default memo(VotingProposalForm);
