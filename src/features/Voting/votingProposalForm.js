import React, { memo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { ButtonGroup, ToggleButton, Badge } from "react-bootstrap";
import { CheckLg } from "react-bootstrap-icons";

const StyledToggleButton = styled(ToggleButton)`
  max-width: fit-content;
`;

// eslint-disable-next-line no-unused-vars
const VotingProposalForm = ({ choices, selectedChoice, setSelectedChoice }) => {
  const handleClick = event => {
    if (event.target.value) setSelectedChoice(event.target.value);
    else setSelectedChoice(undefined);
  };

  return (
    <div>
      <ButtonGroup
        toggle
        className="d-flex flex-row flex-wrap justify-content-center"
      >
        {choices.map((o, index) => (
          <StyledToggleButton
            key={o}
            onClick={handleClick}
            value={o}
            checked={index + 1 === selectedChoice}
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
  selectedChoice: PropTypes.number.isRequired,
  setSelectedChoice: PropTypes.func.isRequired
};

export default memo(VotingProposalForm);
