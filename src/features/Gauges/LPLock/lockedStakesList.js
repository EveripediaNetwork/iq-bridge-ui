import React, { useContext, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { JournalText, CashStack } from "react-bootstrap-icons";
import styled from "styled-components";
import { useWallet } from "use-wallet";

import GenericDialog from "../../../components/ui/genericDialog";
import {
  getEarned,
  getReward
} from "../../../utils/EthDataProvider/GaugesDataProvider";
import { GaugesContext } from "../../../context/gaugesContext";

const LockedStagesListContainer = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  height: 400px;
`;

const StyledCard = styled(Card)`
  min-height: 120px;
  width: 230px;
  max-width: 230px;
`;

const LockedStakesList = ({ lockedStakes, show, setShow, gaugeIdx }) => {
  const { gauges } = useContext(GaugesContext);
  const wallet = useWallet();
  const [rewardsAmount, setRewardsAmount] = useState();

  const handleClaim = async () => {
    await getReward(wallet, gauges[gaugeIdx].address);
  };

  useEffect(() => {
    if (gaugeIdx)
      (async () =>
        setRewardsAmount(await getEarned(wallet, gauges[gaugeIdx].address)))();
  }, [gaugeIdx]);

  return (
    <GenericDialog
      size="lg"
      title={`${lockedStakes.gaugeName}`}
      show={show}
      onHide={() => setShow(false)}
      body={
        <LockedStagesListContainer className="w-100 d-flex flex-row flex-wrap justify-content-center align-items-center">
          <div className="d-flex w-100 flex-wrap flex-row justify-content-center align-items-center">
            <h5 className="m-0">Rewards: {rewardsAmount || 0}</h5>
            <Button
              onClick={handleClaim}
              variant="outline-primary"
              size="sm"
              className="ml-3"
            >
              Claim
              <CashStack className="ml-2" />
            </Button>
          </div>
          <hr />
          {lockedStakes.stakes.map((l, index) => (
            <StyledCard key={index} className="shadow-sm w-100 m-1 p-0">
              <Card.Body className="d-flex p-1 flex-column justify-content-center align-items-center">
                <strong className="monospace">
                  <u>Liquidity:</u>
                </strong>
                <span className="monospace">{l.liquidity.toString()}</span>
                <strong className="monospace">
                  <u>Staked on:</u>
                </strong>
                <span className="monospace">
                  {new Date(
                    Number(l.start_timestamp.toString()) * 1000
                  ).toDateString()}
                </span>
                <strong className="monospace">
                  <u>Stake ending on:</u>
                </strong>
                <span className="monospace">
                  {new Date(
                    Number(l.ending_timestamp.toString()) * 1000
                  ).toDateString()}
                </span>
                <Button size="sm" variant="outline-dark">
                  View on Explorer
                  <JournalText className="ml-2" />
                </Button>
              </Card.Body>
            </StyledCard>
          ))}
        </LockedStagesListContainer>
      }
    />
  );
};

LockedStakesList.propTypes = {
  lockedStakes: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  gaugeIdx: PropTypes.number.isRequired
};

export default LockedStakesList;
