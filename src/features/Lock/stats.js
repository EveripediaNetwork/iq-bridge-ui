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

import { ethBasedExplorerUrl, hiIQRewardsAddress } from "../../config";
import {
  callCheckpoint,
  earned,
  getStats,
  getYield
} from "../../utils/EthDataProvider/EthDataProvider";
import { CoinGeckoClient } from "../../utils/coingecko";

import StatsCharts from "../../components/ui/statsCharts";
import RewardsCalculatorDialog from "../../components/ui/rewardsCalculatorDialog";

const Stats = ({ wallet, lockedAlready }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState();
  const [earnedRewards, setEarnedRewards] = useState();
  const [rewardsInDollars, setRewardsInDollars] = useState();
  const [isLoadingClaim, setLoadingClaim] = useState(false);
  const [show, setShow] = useState(false);
  const [animateText, setAnimateText] = useState(false);
  const [countdown, setCountdown] = useState(Date.now() + 25000);
  const [isCallingCheckpoint, setIsCallingCheckpoint] = useState(false);
  const [openRewardsCalculator, setOpenRewardsCalculator] = useState(false);
  const target = useRef(null);
  const countDownComponentRef = useRef(null);

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
        {completed ? "Loading rewards..." : <>Retrieving in: {seconds} s</>}
      </small>
    </div>
  );

  const handleCallCheckpoint = async () => {
    setIsCallingCheckpoint(true);
    const checkpointResult = await callCheckpoint(wallet);
    await checkpointResult.wait();

    setIsCallingCheckpoint(false);
  };

  useEffect(() => {
    setInterval(() => {
      setAnimateText(true);

      setTimeout(async () => {
        const rewards = await earned(wallet);

        const result = await CoinGeckoClient.coins.fetch("everipedia", {});

        setRewardsInDollars(Number(rewards) * result.data.tickers[6].last);

        setEarnedRewards(Number(rewards));

        setEarnedRewards(Number(rewards));

        setCountdown(Date.now() + 25000);
        if (countDownComponentRef && countDownComponentRef.current)
          countDownComponentRef.current.start();
      }, 1500);
    }, 26000);
  }, []);

  useEffect(() => {
    if (animateText) {
      setTimeout(() => {
        setAnimateText(false);
      }, 1500);
    }
  }, [animateText]);

  useEffect(() => {
    (async () => {
      const rewards = await earned(wallet);
      const { tvl, lockedByUser, hiIQSupply, rewardsAcrossLockPeriod } =
        await getStats(wallet);

      const yearsLock = 4; // assuming a 4 year lock

      const rewardsBasedOnLockPeriod = lockedByUser * (1 + 0.75 * yearsLock);
      const poolRatio =
        rewardsBasedOnLockPeriod / (hiIQSupply + rewardsBasedOnLockPeriod);

      const userRewardsAtTheEndOfLockPeriod =
        rewardsAcrossLockPeriod * yearsLock * poolRatio;
      const userRewardsPlusInitialLock =
        userRewardsAtTheEndOfLockPeriod + lockedByUser;

      const aprAcrossLockPeriod = userRewardsPlusInitialLock / lockedByUser;
      const aprDividedByLockPeriod = (aprAcrossLockPeriod / yearsLock) * 100;

      const result = await CoinGeckoClient.coins.fetch("everipedia", {});

      setRewardsInDollars(Number(rewards) * result.data.tickers[6].last);

      setEarnedRewards(Number(rewards));

      setStats({
        apr: aprDividedByLockPeriod,
        tvl,
        lockedByUser,
        hiIQSupply,
        yearsLock,
        rewardsBasedOnLockPeriod,
        poolRatio,
        rewardsAcrossLockPeriod
      });
    })();
  }, [wallet, lockedAlready]);

  return (
    <Card
      style={{ width: 500, minHeight: 450 }}
      className="shadow-sm m-auto p-1"
    >
      <Card.Body className="p-3 d-flex flex-column justify-content-center">
        <div className="container d-flex flex-row justify-content-center align-items-center">
          <h3 className="text-center font-weight-normal mb-0">{t("Stats")}</h3>
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
          <Col sm={8} className="p-0 d-flex flex-column justify-content-center">
            <StatsCharts />
          </Col>
          <Col sm={4} className="p-0 d-flex flex-column justify-content-center">
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
                {lockedAlready ? (
                  <>
                    <div className="m-0 text-center">
                      <div className="d-flex flex-row justify-content-center align-items-center">
                        <strong className="mr-3">APR</strong>
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
                        <Overlay
                          style={{ display: show ? "block" : "none" }}
                          target={target.current}
                          show={show}
                          placement="bottom"
                        >
                          {props => (
                            <Tooltip {...props}>
                              {t("calculation_based_on_4_years")}
                            </Tooltip>
                          )}
                        </Overlay>
                      </div>
                      <span className="text-info">
                        {Number(stats.apr).toFixed(2)}%
                      </span>
                    </div>
                    <hr />
                  </>
                ) : null}

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

                {earnedRewards && earnedRewards > 0 ? (
                  <>
                    <p className="m-0 text-center">
                      {" "}
                      <strong>{t("rewards")}</strong>
                      <br />
                      <span>
                        <span className={animateText ? "animate" : ""}>
                          {Humanize.toFixed(earnedRewards, 4)}{" "}
                          <strong className="text-dark">IQ</strong>
                        </span>{" "}
                      </span>
                    </p>
                    <hr />
                    <p className="m-0 text-center">
                      {" "}
                      <strong>USD equivalent</strong>
                      <br />
                      <span>
                        <span className={animateText ? "animate" : ""}>
                          {Humanize.toFixed(rewardsInDollars, 4)}{" "}
                          <strong className="text-dark">USD</strong>
                        </span>{" "}
                      </span>
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
                  {earnedRewards && earnedRewards > 0 ? (
                    <Button
                      disabled={isLoadingClaim || earnedRewards <= 0}
                      onClick={handleClaim}
                      size="sm"
                      className="shadow-sm"
                      variant="success"
                    >
                      {!isLoadingClaim ? t("claim") : `${t("loading")}...`}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCallCheckpoint}
                      size="sm"
                      className="shadow-sm"
                      variant="warning"
                    >
                      {isCallingCheckpoint ? "Loading..." : "Checkpoint"}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="container h-100 d-flex flex-column justify-content-center align-items-center">
                <Spinner animation="grow" variant="primary" />
              </div>
            )}
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
    </Card>
  );
};

Stats.propTypes = {
  wallet: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  lockedAlready: PropTypes.bool.isRequired
};

export default memo(Stats);
