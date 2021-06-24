import React, { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  ButtonGroup,
  ToggleButton,
  Badge,
  ToggleButtonGroup
} from "react-bootstrap";
import { CheckLg } from "react-bootstrap-icons";

const StyledToggleButton = styled(ToggleButton)`
  max-width: fit-content;
`;

// eslint-disable-next-line no-unused-vars
const VotingProposalForm = ({
  choices,
  selectedChoice,
  setSelectedChoice,
  votingType,
  onVotingTimeWindow
}) => {
  const { t } = useTranslation();
  const [showBadge, setShowBadge] = useState(false);

  const handleClick = event => {
    if (!onVotingTimeWindow) return;
    if (event.target.value) {
      setSelectedChoice(event.target.value);
      setShowBadge(true);
    } else setSelectedChoice(undefined);
  };

  useEffect(() => {
    if (selectedChoice && showBadge) setShowBadge(false);
  }, [selectedChoice]);

  const buttonDetails = (o, index) => (
    <>
      <span>{o}</span>{" "}
      {index + 1 === selectedChoice && (
        <Badge variant="success">
          <CheckLg />
        </Badge>
      )}
    </>
  );

  return (
    <div className="text-center">
      {votingType !== "single-choice" ? (
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
              {buttonDetails(o, index)}
            </StyledToggleButton>
          ))}
        </ButtonGroup>
      ) : (
        <ToggleButtonGroup type="checkbox" onClick={handleClick}>
          {choices.map((o, index) => (
            <StyledToggleButton
              key={o}
              disabled={!onVotingTimeWindow}
              value={o}
              variant="light"
              type="checkbox"
              className="shadow m-1 rounded"
            >
              <span>{o}</span>{" "}
            </StyledToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
      {showBadge && <h6 className="mt-2" variant="primary"></h6>}
    </div>
  );
};

VotingProposalForm.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.string).isRequired, // eslint-disable-line react/forbid-prop-types,
  selectedChoice: PropTypes.number,
  setSelectedChoice: PropTypes.func.isRequired,
  votingType: PropTypes.string.isRequired,
  onVotingTimeWindow: PropTypes.bool
};

VotingProposalForm.defaultProps = {
  selectedChoice: 1000,
  onVotingTimeWindow: false
};

export default memo(VotingProposalForm);
