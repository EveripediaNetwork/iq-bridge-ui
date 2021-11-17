import React, { memo, useContext, useState, lazy, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useWallet } from "use-wallet";
import PropTypes from "prop-types";
import styled from "styled-components";

import { GaugesContext } from "../../context/gaugesContext";
import { voteForGauge } from "../../utils/EthDataProvider/GaugesDataProvider";
import StyledSlider from "../../components/ui/styledSlider";

const GaugesList = lazy(() => import("./gaugesList"));

const StyledCard = styled(Card)`
  padding: 10px;
  margin: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const GaugesVoting = ({ votingPower }) => {
  const { gauges } = useContext(GaugesContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [weight, setWeight] = useState(0);
  const wallet = useWallet();

  const onSubmitVoteButtonClick = async () => {
    await voteForGauge(wallet, gauges[activeIndex].address, weight);
  };

  useEffect(() => {
    if (
      gauges &&
      gauges.length > 0 &&
      gauges[activeIndex].blockTime &&
      gauges[activeIndex].nextVotingDate
    )
      setSubmitButtonDisabled(
        gauges[activeIndex].blockTime < gauges[activeIndex].nextVotingDate
      );
  }, [gauges, activeIndex]);

  return (
    <StyledCard style={{ width: 300, height: "auto" }}>
      <Card.Title>Voting</Card.Title>
      <Card.Body className="p-0 w-100 d-flex flex-column justify-content-center">
        <GaugesList
          activeIndex={activeIndex}
          setActiveIndex={activeIdx => {
            setActiveIndex(activeIdx);
            // updateActiveIndex(activeIdx);
          }}
        />
        <div className="d-flex flex-column text-center justify-content-center">
          <h5>Power to allocate</h5>
          <div className="d-flex flex-column justify-content-between pl-3 pr-3">
            <StyledSlider
              disabled={votingPower === 0}
              onChange={setWeight}
              min={0}
              max={votingPower || 100}
            />
            <span className="font-weight-bold mt-2">
              {votingPower > 0 ? (
                <>
                  {weight} of {votingPower}
                </>
              ) : (
                "You have no HiIQ"
              )}
            </span>
          </div>
        </div>
        <div className="container text-center mt-3">
          <Button
            disabled={votingPower === 0 || submitButtonDisabled}
            onClick={onSubmitVoteButtonClick}
            variant="primary"
            className="text-uppercase"
            size="sm"
          >
            <strong>Submit Vote</strong>
          </Button>
        </div>
      </Card.Body>
    </StyledCard>
  );
};

GaugesVoting.propTypes = {
  votingPower: PropTypes.number
};

GaugesVoting.defaultProps = {
  votingPower: 0
};

export default memo(GaugesVoting);
