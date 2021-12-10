import React, {
  memo,
  useContext,
  useState,
  lazy,
  useEffect,
  useRef
} from "react";
import { Card, Button } from "react-bootstrap";
import { useWallet } from "use-wallet";
import { useTranslation } from "react-i18next";
import { JournalText, ArrowRight } from "react-bootstrap-icons";
import styled from "styled-components";

import { GaugesContext } from "../../context/gaugesContext";
import {
  getUserVotingPower,
  voteForGauge
} from "../../utils/EthDataProvider/GaugesDataProvider";
import { ethBasedExplorerUrl, gaugeControllerAddr } from "../../config";
import { getTokensUserBalanceLocked } from "../../utils/EthDataProvider/EthDataProvider";
import StyledSlider from "../../components/ui/styledSlider";
import GenericOverlay from "../../components/ui/genericOverlay";

const GaugesList = lazy(() => import("./gaugesList"));

const StyledCard = styled(Card)`
  border: 0.5px solid whitesmoke !important;
  width: 300px;
  height: auto;
  padding: 10px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledFlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const GaugesVoting = () => {
  const { t } = useTranslation();
  const { gauges } = useContext(GaugesContext);
  const [votingPower, setVotingPower] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState();
  const [currentHiIQ, setCurrentHiIQ] = useState(undefined);
  const [voting, setVoting] = useState(false);
  const [weight, setWeight] = useState(0);
  const [showPowerToAllocateOverlay, setShowPowerToAllocateOverlay] =
    useState(false);
  const [showVotingTitleOverlay, setShowVotingTitleOverlay] = useState(false);
  const [reloadNextVotingTime, setReloadNextVotingTime] = useState();
  const wallet = useWallet();
  const powerToAllocateOverlayTarget = useRef(null);
  const votingTitleOverlayTarget = useRef(null);

  const onSubmitVoteButtonClick = async () => {
    setVoting(true);
    await voteForGauge(wallet, gauges[activeIndex].address, weight);
    setReloadNextVotingTime(true);
    setVoting(false);
  };

  useEffect(() => {
    if (
      gauges &&
      gauges.length > 0 &&
      gauges[activeIndex].blockTime &&
      gauges[activeIndex].nextVotingDate
    ) {
      setSubmitButtonDisabled(
        gauges[activeIndex].blockTime < gauges[activeIndex].nextVotingDate
      );
    }
  }, [gauges, activeIndex]);

  useEffect(() => {
    if (wallet.status === "connected") {
      (async () => {
        setVotingPower(await getUserVotingPower(wallet));
        setCurrentHiIQ(Number(await getTokensUserBalanceLocked(wallet)));
      })();
    } else setVotingPower(0);
  }, [wallet.status]);

  return (
    <StyledCard>
      {currentHiIQ !== undefined && currentHiIQ > 0 ? (
        <>
          <StyledFlexRow>
            <Card.Title className="m-0">{t("voting")}</Card.Title>
            <GenericOverlay
              show={showVotingTitleOverlay}
              setShow={setShowVotingTitleOverlay}
              target={votingTitleOverlayTarget}
              tooltipText="You can use your voting power to vote for the allocation of Gauge rewards to specific gauges"
            />
          </StyledFlexRow>
          <Card.Body className="p-0 w-100 d-flex flex-column justify-content-center">
            <GaugesList
              activeIndex={activeIndex}
              setActiveIndex={activeIdx => {
                setActiveIndex(activeIdx);
              }}
              reloadNextVotingTime={reloadNextVotingTime}
              setReloadNextVotingTime={setReloadNextVotingTime}
            />
            <div className="d-flex flex-column text-center justify-content-center">
              <StyledFlexRow className="mb-2">
                <h5 className="m-0">{t("power_to_allocate")}</h5>
                <GenericOverlay
                  show={showPowerToAllocateOverlay}
                  setShow={setShowPowerToAllocateOverlay}
                  target={powerToAllocateOverlayTarget}
                  tooltipText="Remaining Voting Power that can be allocated. Max is 10.000"
                />
              </StyledFlexRow>
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
                    t("you_have_no_hiiq")
                  )}
                </span>
              </div>
            </div>
            <div className="text-center mt-3 d-flex flex-row justify-content-center align-items-center">
              <div className="d-flex flex-row justify-content-center align-items-center">
                <Button
                  disabled={
                    votingPower === 0 ||
                    submitButtonDisabled === undefined ||
                    (submitButtonDisabled !== undefined &&
                      submitButtonDisabled === true) ||
                    voting
                  }
                  onClick={onSubmitVoteButtonClick}
                  variant="primary"
                  className="text-uppercase"
                  size="sm"
                >
                  <strong>
                    {voting ? `${t("loading")}...` : t("submit_vote")}
                  </strong>
                </Button>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark ml-2"
                  href={`${ethBasedExplorerUrl}address/${gaugeControllerAddr}`}
                >
                  <JournalText size="20px" />
                </a>
              </div>
            </div>
          </Card.Body>
        </>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <p className="text-center">{t("to_be_allowed_to_vote")}</p>
          <Button variant="ligh" size="sm" className="shadow-sm">
            <a href={`${window.location.origin}/lock`}>
              {t("lock_iq")} <ArrowRight />
            </a>
          </Button>
        </div>
      )}
    </StyledCard>
  );
};

export default memo(GaugesVoting);
