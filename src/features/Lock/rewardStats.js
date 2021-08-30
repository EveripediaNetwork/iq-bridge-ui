import React, { memo, useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import * as Humanize from "humanize-plus";
import { JournalText } from "react-bootstrap-icons";

import { ethBasedExplorerUrl, hiIQRewardsAddress } from "../../config";
import {
  callCheckpoint,
  earned,
  getStats,
  getYield
} from "../../utils/EthDataProvider/EthDataProvider";

const RewardStats = ({ wallet, hiIQBalance }) => {
  const [stats, setStats] = useState();
  const [isLoadingClaim, setLoadingClaim] = useState(false);

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
      console.log(rewards);
      const { tvl, apr } = await getStats(wallet);
      // const apr = Number(
      //   yourDailyRewards.mul(36500).div(hiIQBalanceBN)
      // ).toFixed(2);
      console.log(tvl);
      setStats({
        apr, // TODO: calculate APR based in time their stake
        rewards,
        tvl
      });
    })();
  }, [wallet]);

  return (
    <Card style={{ width: 220 }} className="shadow m-auto p-1">
      <Card.Body className="p-1">
        <div className="container d-flex flex-row justify-content-center align-items-center">
          <h3 className="text-center font-weight-normal mb-0">Rewards</h3>
          <a
            target="_blank"
            rel="noopener noreferrrer"
            className="text-dark ml-2"
            href={`${ethBasedExplorerUrl}address/${hiIQRewardsAddress}`}
          >
            <JournalText size="20px" />
          </a>
        </div>
        <hr className="shadow" />
        {stats !== undefined ? (
          <div className="container">
            {stats.apr ? (
              <>
                <p className="m-0 text-center">
                  {" "}
                  <strong>Current APR</strong>
                  <br />
                  <span>{stats.apr}%</span>
                </p>
                <hr className="shadow" />
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

            <hr className="shadow" />

            <p className="m-0 text-center">
              {" "}
              <strong>Your Rewards</strong>
              <br />
              <span>
                <span className="text-info font-weight-normal">
                  {Humanize.toFixed(stats.rewards, 4)}{" "}
                  <strong className="text-dark">IQ</strong>
                </span>{" "}
              </span>
            </p>
            <hr className="shadow m-0 mt-4" />

            <div className="container mt-4 text-center">
              <Button
                disabled={isLoadingClaim || stats.rewards <= 0}
                onClick={handleClaim}
                size="sm"
                variant="success"
              >
                {!isLoadingClaim ? "Claim rewards" : "Loading..."}
              </Button>
            </div>
          </div>
        ) : null}
      </Card.Body>
    </Card>
  );
};

RewardStats.propTypes = {
  wallet: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  hiIQBalance: PropTypes.number.isRequired
};

export default memo(RewardStats);
