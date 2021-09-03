import React, { memo, useEffect, useState, useRef } from "react";
import { Card, Button, Overlay, Tooltip } from "react-bootstrap";
import PropTypes from "prop-types";
import * as Humanize from "humanize-plus";

import { QuestionCircle, JournalText, Calculator } from "react-bootstrap-icons";

import { ethBasedExplorerUrl, hiIQRewardsAddress } from "../../config";
import {
  callCheckpoint,
  earned,
  getStats,
  getYield
} from "../../utils/EthDataProvider/EthDataProvider";

import RewardsCalculatorDialog from "../../components/ui/rewardsCalculatorDialog";

const Stats = ({ wallet }) => {
  const [stats, setStats] = useState();
  const [isLoadingClaim, setLoadingClaim] = useState(false);
  const [show, setShow] = useState(false);
  const [openRewardsCalculator, setOpenRewardsCalculator] = useState(false);
  const target = useRef(null);

  const handleClaim = async () => {
    setLoadingClaim(true);
    const result = await getYield(wallet);
    await result.wait();
    setLoadingClaim(false);
    await callCheckpoint(wallet);
  };

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

      setStats({
        apr: aprDividedByLockPeriod,
        rewards,
        tvl,
        lockedByUser,
        hiIQSupply,
        yearsLock,
        rewardsBasedOnLockPeriod,
        poolRatio,
        rewardsAcrossLockPeriod
      });
    })();
  }, [wallet]);

  return (
    <Card style={{ width: 460 }} className="shadow-sm m-auto p-1">
      <Card.Body className="p-1">
        <div className="container d-flex flex-row justify-content-center align-items-center">
          <h3 className="text-center font-weight-normal mb-0">Stats</h3>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark ml-2"
            href={`${ethBasedExplorerUrl}address/${hiIQRewardsAddress}`}
          >
            <JournalText size="20px" />
          </a>
        </div>
        <hr className="shadow" />
        {stats !== undefined ? (
          <div className="container">
            <div className="mb-4 mt-2 text-center">
              <Button
                onClick={() => setOpenRewardsCalculator(!openRewardsCalculator)}
                className="shadow-sm"
                variant="outline-dark"
                size="sm"
              >
                <small>Rewards Calculator</small>
                <Calculator />
              </Button>
            </div>
            <div className="m-0 text-center">
              <div className="d-flex flex-row justify-content-between align-items-center">
                <strong>APR</strong>
                <Button
                  variant="light"
                  size="sm"
                  ref={target}
                  onClick={() => setShow(!show)}
                >
                  <QuestionCircle />
                </Button>
                <Overlay target={target.current} show={show} placement="right">
                  {props => (
                    <Tooltip {...props}>
                      This calculation is based on 4 years lock
                    </Tooltip>
                  )}
                </Overlay>
              </div>
              <br />
              <span>{Number(stats.apr).toFixed(2)}%</span>
            </div>
            <hr className="shadow" />

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

            <hr className="shadow" />

            {/* <p className="m-0 text-center">
              {" "}
              <strong>Next Distribution</strong>
              <br />
              <span>
                <span className="text-info font-weight-normal">
                  {`${new Date(
                    stats.timeCursor.toString() * 1000
                  ).toDateString()}`}
                </span>{" "}
              </span>
            </p> */}

            {/* <hr className="shadow" /> */}

            <p className="m-0 text-center">
              {" "}
              <strong>Rewards</strong>
              <br />
              <span>
                <span className="text-info font-weight-normal">
                  {Humanize.toFixed(stats.rewards, 4)}{" "}
                  <strong className="text-dark">IQ</strong>
                </span>{" "}
              </span>
            </p>
            <hr className="shadow m-0 mt-4" />
            <div className="container mt-2 text-center">
              <Button
                disabled={isLoadingClaim || stats.rewards <= 0}
                onClick={handleClaim}
                size="sm"
                className="shadow-sm"
                variant="outline-success"
              >
                {!isLoadingClaim ? "Claim" : "Loading..."}
              </Button>
            </div>
          </div>
        ) : null}
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
  hiIQBalance: PropTypes.number.isRequired
};

export default memo(Stats);
