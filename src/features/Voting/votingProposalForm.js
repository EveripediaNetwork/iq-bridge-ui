import React, { memo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { ButtonGroup, ToggleButton, Badge } from "react-bootstrap";
import { CheckLg } from "react-bootstrap-icons";

const StyledToggleButton = styled(ToggleButton)`
  max-width: fit-content;
`;

// eslint-disable-next-line no-unused-vars
const VotingProposalForm = ({
  choices,
  selectedChoice,
  setSelectedChoice,
  onVotingTimeWindow
}) => {
  const handleClick = event => {
    if (!onVotingTimeWindow) return;
    if (event.target.value) setSelectedChoice(event.target.value);
    else setSelectedChoice(undefined);
  };

  return (
    <div className="text-center">
      <ButtonGroup
        toggle
        onClick={handleClick}
        className="d-flex flex-row flex-wrap justify-content-center"
      >
        {choices.map((o, index) => (
          <StyledToggleButton
            checked={index + 1 === selectedChoice}
            key={o}
            disabled={!onVotingTimeWindow}
            value={o}
            variant="light"
            type="radio"
            className="shadow m-1 rounded"
          >
            <span>{o}</span>{" "}
            {index + 1 === selectedChoice && (
              <Badge variant="success">
                <CheckLg />
              </Badge>
            )}
          </StyledToggleButton>
        ))}
      </ButtonGroup>
    </div>
  );
};

VotingProposalForm.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.string).isRequired, // eslint-disable-line react/forbid-prop-types,
  selectedChoice: PropTypes.number,
  setSelectedChoice: PropTypes.func.isRequired,
  onVotingTimeWindow: PropTypes.bool
};

VotingProposalForm.defaultProps = {
  selectedChoice: 1000,
  onVotingTimeWindow: false
};

export default memo(VotingProposalForm);
