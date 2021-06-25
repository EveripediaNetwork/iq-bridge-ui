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
      if (votingType === "approval") setShowBadge(true);
    } /*else setSelectedChoice(undefined);*/
  };

  useEffect(() => {
    if (
      votingType === "approval" &&
      selectedChoice &&
      selectedChoice.length === 0
    )
      setShowBadge(false);
  }, [selectedChoice]);

  const buttonDetails = (o, index) => {
    console.log(index + 1);
    if (selectedChoice) console.log(index + 1 === selectedChoice[index]);
    const badge = () => (
      <Badge variant="success">
        <CheckLg />
      </Badge>
    );
    return (
      <>
        {o && <span>{o}</span>}
        {votingType === "single-choice" && index + 1 === selectedChoice && (
          <>{badge()}</>
        )}
        {votingType === "approval" &&
          selectedChoice &&
          selectedChoice.length > 0 &&
          index + 1 === selectedChoice.find(e => e === index + 1) && (
            <>{badge()}</>
          )}
      </>
    );
  };

  console.log(selectedChoice);

  return (
    <div className="text-center">
      {votingType === "single-choice" && (
        <ButtonGroup
          toggle
          onClick={handleClick}
          className="d-flex my-3 flex-row flex-wrap justify-content-center"
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
      )}
      {votingType === "approval" && (
        <ToggleButtonGroup
          className="w-100 my-3 justify-content-center"
          type="checkbox"
          onClick={handleClick}
        >
          {choices.map((o, index) => (
            <StyledToggleButton
              key={o}
              disabled={!onVotingTimeWindow}
              value={o}
              variant="light"
              type="checkbox"
              className="shadow m-1 rounded"
            >
              {buttonDetails(o, index)}
            </StyledToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
      {showBadge && selectedChoice && (
        <h6 className="mt-2" variant="primary">
          <Badge variant="primary">{selectedChoice.length}</Badge>
        </h6>
      )}
    </div>
  );
};

VotingProposalForm.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.string).isRequired, // eslint-disable-line react/forbid-prop-types,
  selectedChoice: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  setSelectedChoice: PropTypes.func.isRequired,
  votingType: PropTypes.string.isRequired,
  onVotingTimeWindow: PropTypes.bool
};

VotingProposalForm.defaultProps = {
  onVotingTimeWindow: false
};

export default memo(VotingProposalForm);
