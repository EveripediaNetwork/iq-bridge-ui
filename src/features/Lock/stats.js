import React, { memo, useEffect, useState, useRef } from "react";
import {
  Card,
  Button,
  Overlay,
  Tooltip,
  Spinner,
  Row,
  Col
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import * as Humanize from "humanize-plus";
import Countdown from "react-countdown";
import { QuestionCircle, JournalText, Calculator } from "react-bootstrap-icons";

import styled from "styled-components";
import { ethBasedExplorerUrl, hiIQRewardsAddress } from "../../config";
import {
  callCheckpoint,
  earned,
  getStats,
  getYield,
  defaultStats,
  checkIfUserIsInitialized
} from "../../utils/EthDataProvider/EthDataProvider";
import CardTitle from "../../components/ui/cardTitle";
import StatsCharts from "../../components/ui/statsCharts";
import RewardsCalculatorDialog from "../../components/ui/rewardsCalculatorDialog";
import EthereumWalletModal from "../../components/ui/ethereumWalletModal";

const PriceSpan = styled.span`
  font-size: 12px;
  color: #aeabab;
`;

const StyledCard = styled(Card)`
  max-width: 100%;

  @media (min-width: 576px) {
    &.card {
      min-width: 563px;
    }
  }
`;

const StyledStatsContainer = styled.div`
  width: auto;
  margin: auto;

  @media (max-width: 576px) {
    width: 100%;
    max-width: 100%;
  }
`;

const epCoingeckoUrl =
  "https://api.coingecko.com/api/v3/simple/price?ids=everipedia&vs_currencies=usd";

const Stats = ({ wallet, lockedAlready }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState();
  const [earnedRewards, setEarnedRewards] = useState();
  const [rewardsInDollars, setRewardsInDollars] = useState();
  const [isLoadingClaim, setLoadingClaim] = useState(false);
  const [ethModalShow, setEthModalShow] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState();
  const [show, setShow] = useState(false);
  const [showCheckpointOverlay, setShowCheckpointOverlay] = useState(false);
  const [animateText, setAnimateText] = useState(false);
  const [countdown, setCountdown] = useState(Date.now() + 25000);
  const [isCallingCheckpoint, setIsCallingCheckpoint] = useState(false);
  const [openRewardsCalculator, setOpenRewardsCalculator] = useState(false);
  const [userIsInitialized, setUserIsInitialzed] = useState(undefined);
  const checkpointOverlayTarget = useRef(null);
  const countDownComponentRef = useRef(null);
  const target = useRef(null);

  const handleClaim = async () => {
    setLoadingClaim(true);
    const result = await getYield(wallet);
    await result.wait();
    setLoadingClaim(false);
  };

  const renderer = ({ seconds, completed }) => (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <hr />
      <small className="font-italic text-muted text-center">
        {completed ? (
          t("loading_rewards")
        ) : (
          <>
            {t("retrieving_in")} {seconds} s
          </>
        )}
      </small>
    </div>
  );

  const handleCallCheckpoint = async () => {
    setIsCallingCheckpoint(true);
    const checkpointResult = await callCheckpoint(wallet);
    await checkpointResult.wait();

    setIsCallingCheckpoint(false);
    if (checkpointResult) setUserIsInitialzed(true);
  };

  const getOverlay = (showOverlay, overlayTarget, tooltipText) => (
    <Overlay
      style={{
        display: showOverlay ? "block" : "none"
      }}
      target={overlayTarget.current}
      show={showOverlay}
      placement="bottom"
    >
      {props => <Tooltip {...props}>{tooltipText}</Tooltip>}
    </Overlay>
  );

  const calculateStats = (
    tvl,
    lockedByUser,
    hiIQSupply,
    rewardsAcrossLockPeriod
  ) => {
    const yearsLock = 1; // assuming a 1 year lock

    const amountLocked = lockedByUser > 0 ? lockedByUser : 1000000;

    const rewardsBasedOnLockPeriod = amountLocked * (1 + 0.75 * yearsLock);
    const poolRatio =
      rewardsBasedOnLockPeriod / (hiIQSupply + rewardsBasedOnLockPeriod);

    const userRewards = rewardsAcrossLockPeriod * yearsLock * poolRatio;

    const aprAcrossLockPeriod = (userRewards / amountLocked) * 100;

    // calculate a 4 year lock with 1M IQ
    let yieldWithA4YearLock = 1 * (1 + 0.75 * 4);
    // eslint-disable-next-line operator-assignment
    yieldWithA4YearLock =
      yieldWithA4YearLock / (hiIQSupply + yieldWithA4YearLock);

    // eslint-disable-next-line operator-assignment
    yieldWithA4YearLock = rewardsAcrossLockPeriod * 4 * yieldWithA4YearLock;
    yieldWithA4YearLock = (yieldWithA4YearLock / 1) * 100;
    //

    return {
      yieldWithA4YearLock,
      apr: aprAcrossLockPeriod,
      tvl,
      lockedByUser,
      hiIQSupply,
      yearsLock,
      rewardsBasedOnLockPeriod,
      poolRatio,
      rewardsAcrossLockPeriod
    };
  };

  useEffect(() => {
    if (animateText) {
      setTimeout(() => {
        setAnimateText(false);
      }, 1500);
    }
  }, [animateText]);

  useEffect(() => {
    if (wallet.status !== "connected") {
      return;
    }

    setInterval(() => {
      setAnimateText(true);

      setTimeout(async () => {
        const rewards = await earned(wallet);
        try {
          const a = await fetch(epCoingeckoUrl);
          const price = (await a.json()).everipedia.usd;

          setRewardsInDollars(Number(rewards) * price);
        } catch (err) {
          console.error(err);
        }

        setEarnedRewards(Number(rewards));
        setCountdown(Date.now() + 25000);
        if (countDownComponentRef && countDownComponentRef.current)
          countDownComponentRef.current.start();
      }, 1500);
    }, 26000);
  }, [wallet]);

  useEffect(() => {
    (async () => {
      if (wallet && wallet.status === "connected") {
        setUserIsInitialzed(await checkIfUserIsInitialized(wallet));

        const rewards = await earned(wallet);

        try {
          const a = await fetch(epCoingeckoUrl);
          const price = (await a.json()).everipedia.usd;

          setRewardsInDollars(Number(rewards) * price);
        } catch (err) {
          console.error(err);
        }

        setEarnedRewards(Number(rewards));

        const { tvl, lockedByUser, hiIQSupply, rewardsAcrossLockPeriod } =
          await getStats(wallet);

        setStats(
          calculateStats(tvl, lockedByUser, hiIQSupply, rewardsAcrossLockPeriod)
        );
      }

      if (wallet && wallet.status === "disconnected") {
        setIsLoadingStats(true);
        const { tvl, hiIQSupply, rewardsAcrossLockPeriod } =
          await defaultStats(); // TODO: move to right place (user is not logged). example to get APR without wallet connected: use value for base APR (rename to just APR)

        setStats(
          calculateStats(tvl, undefined, hiIQSupply, rewardsAcrossLockPeriod)
        );

        setIsLoadingStats(false);
      }
    })();
  }, [wallet, lockedAlready]);

  return (
    <StyledStatsContainer className="d-flex flex-column justify-content-center align-items-center">
      <CardTitle title="Stats" aria-label="lock" icon="📈" />
      <StyledCard className="shadow-sm m-auto p-1">
        <Card.Body className="p-3 d-flex flex-column justify-content-center">
          <div className="container d-flex flex-row justify-content-center align-items-center">
            <h3 className="text-center font-weight-normal mb-0">
              {t("Stats")}
            </h3>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark ml-2"
              href={`${ethBasedExplorerUrl}address/${hiIQRewardsAddress}`}
            >
              <JournalText size="20px" />
            </a>
          </div>
          <hr />
          <Row>
            <Col
              sm={8}
              className="p-0 d-flex flex-column justify-content-center"
            >
              <StatsCharts />
            </Col>
            <Col
              sm={4}
              className="p-0 d-flex flex-column justify-content-center"
            >
              {stats !== undefined ? (
                <div className="container d-flex flex-column justify-content-between">
                  <div className="mb-4 mt-2 text-center">
                    <Button
                      onClick={() => {
                        setOpenRewardsCalculator(!openRewardsCalculator);
                      }}
                      className="shadow-sm"
                      variant="outline-dark"
                      size="sm"
                    >
                      {t("rewards_calculator")}
                      <Calculator />
                    </Button>
                  </div>
                  <p className="m-0 text-center">
                    {" "}
                    <strong>{t("with_4year_lock")}</strong>
                    <br />
                    <span>
                      <span className="text-info">
                        ≈ {Humanize.intComma(stats.yieldWithA4YearLock)}
                        <strong className="text-info">%</strong>
                      </span>
                    </span>
                  </p>
                  <div className="m-0 text-center">
                    <div className="d-flex flex-row justify-content-center text-center align-items-center">
                      <span className="mr-2 font-weight-bold">APR</span>
                      {wallet && wallet.status === "disconnected" ? (
                        <>
                          <Button
                            variant="light"
                            size="sm"
                            ref={target}
                            onClick={event => {
                              event.preventDefault();
                              setShow(!show);
                            }}
                          >
                            <QuestionCircle />
                          </Button>
                          {getOverlay(show, target, t("with_1m_lock"))}
                        </>
                      ) : null}
                    </div>
                    <span className="text-info">
                      {Number(stats.apr).toFixed(2)}%
                    </span>
                  </div>
                  <hr />

                  <p className="m-0 text-center">
                    {" "}
                    <strong>TVL</strong>
                    <br />
                    <span>
                      <span className="text-info">
                        {Humanize.intComma(stats.tvl)}{" "}
                        <strong className="text-dark">IQ</strong>
                      </span>
                    </span>
                  </p>
                  <hr />
                  <div className="container p-0 d-flex flex-column mt-2 text-center">
                    {earnedRewards &&
                    earnedRewards > 0 &&
                    wallet.status === "connected" ? (
                      <>
                        <p className="m-0 text-center d-flex flex-column">
                          {" "}
                          <strong>{t("rewards")}</strong>
                          <br />
                          <span>
                            <span className={animateText ? "animate" : ""}>
                              {Humanize.toFixed(earnedRewards, 4)}{" "}
                              <strong className="text-dark">IQ</strong>
                            </span>{" "}
                          </span>
                          <PriceSpan>
                            ${Humanize.toFixed(rewardsInDollars, 2)}{" "}
                          </PriceSpan>
                        </p>
                        <Countdown
                          ref={countDownComponentRef}
                          autoStart
                          date={countdown}
                          renderer={renderer}
                        />
                        <hr className="shadow m-0 mt-4" />
                      </>
                    ) : null}
                    <div className="container mt-2 text-center">
                      {earnedRewards &&
                      earnedRewards > 0 &&
                      wallet.status === "connected" ? (
                        <Button
                          disabled={isLoadingClaim || earnedRewards <= 0}
                          onClick={handleClaim}
                          size="sm"
                          className="shadow-sm"
                          variant="success"
                        >
                          {!isLoadingClaim ? t("claim") : `${t("loading")}...`}
                        </Button>
                      ) : null}

                      {
                        // (lockedAlready &&
                        //   earnedRewards !== undefined &&
                        //   earnedRewards === 0 &&
                        //   wallet.status === "connected") ||
                        lockedAlready &&
                        userIsInitialized !== undefined &&
                        userIsInitialized === false ? (
                          // eslint-disable-next-line react/jsx-indent
                          <div className="d-flex flex-row justify-content-center align-items-center">
                            <Button
                              onClick={handleCallCheckpoint}
                              size="sm"
                              className="shadow-sm"
                              variant="warning"
                            >
                              {isCallingCheckpoint
                                ? `${t("loading")}...`
                                : t("checkpoint")}
                            </Button>
                            <Button
                              variant="light"
                              size="sm"
                              className="ml-2"
                              ref={checkpointOverlayTarget}
                              onClick={event => {
                                event.preventDefault();
                                setShowCheckpointOverlay(
                                  !showCheckpointOverlay
                                );
                              }}
                            >
                              <QuestionCircle />
                            </Button>
                            {getOverlay(
                              showCheckpointOverlay,
                              checkpointOverlayTarget,
                              t("needed_to_keep_track")
                            )}
                          </div>
                        ) : null
                      }
                    </div>
                  </div>
                </div>
              ) : null}
              {isLoadingStats === false && wallet.status === "disconnected" ? (
                <div className="d-flex flex-column p-4">
                  <span className="text-center font-italic">
                    {t("login_to_see_more_stats")}
                  </span>
                  <Button
                    onClick={() => setEthModalShow(true)}
                    variant="light"
                    className="rounded-0 mt-2 font-weight-bold"
                  >
                    {t("login")}
                  </Button>
                </div>
              ) : null}
              {isLoadingStats && isLoadingStats === true ? (
                <div className="container h-100 d-flex flex-column justify-content-center align-items-center">
                  <Spinner animation="grow" variant="primary" />
                </div>
              ) : null}
            </Col>
          </Row>
        </Card.Body>
        {stats && stats.hiIQSupply ? (
          <RewardsCalculatorDialog
            openRewardsCalculator={openRewardsCalculator}
            setOpenRewardsCalculator={setOpenRewardsCalculator}
            hiIQSupply={stats.hiIQSupply}
            rewardsAcrossLockPeriod={stats.rewardsAcrossLockPeriod}
          />
        ) : null}
      </StyledCard>
      <EthereumWalletModal show={ethModalShow} setShow={setEthModalShow} />
    </StyledStatsContainer>
  );
};

Stats.defaultProps = {
  wallet: undefined,
  lockedAlready: false
};

Stats.propTypes = {
  wallet: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  lockedAlready: PropTypes.bool
};

export default memo(Stats);
