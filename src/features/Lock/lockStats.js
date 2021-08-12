import React, { memo, useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import * as Humanize from "humanize-plus";

import { getStats, earned } from "../../utils/EthDataProvider/EthDataProvider";

const LockStats = ({ wallet, hiIQBalance }) => {
  const [stats, setStats] = useState();
  useEffect(() => {
    (async () => {
      const { supply, tvl } = await getStats(wallet);
      const rewards = await earned(wallet);
      setStats({
        apr: Number((hiIQBalance / supply) * 365 * 100).toFixed(2),
        rewards,
        tvl
      });
    })();
  }, [wallet]);

  return (
    <Card style={{ width: 220 }} className="shadow p-1">
      <Card.Body className="p-1">
        <h3 className="text-center font-weight-normal">Rewards</h3>
        <hr className="shadow" />
        {stats !== undefined ? (
          <div className="container">
            {stats.apr ? (
              <>
                <p className="m-0 text-center">
                  {" "}
                  <strong>Your APR</strong>
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

            <hr style={{ margin: "4px 0" }} className="shadow" />

            <p className="m-0 text-center">
              {" "}
              <strong>Unclaimed Rewards</strong>
              <br />
              <span>
                <span className="text-info font-weight-normal">
                  {Humanize.intComma(stats.rewards)}{" "}
                  <strong className="text-dark">IQ</strong>
                </span>{" "}
              </span>
            </p>
            <hr style={{ margin: "4px 0" }} className="shadow" />
            <div className="container mt-4 text-center">
              <Button size="sm" variant="success">
                Claim rewards
              </Button>
            </div>
          </div>
        ) : null}
      </Card.Body>
    </Card>
  );
};

LockStats.propTypes = {
  wallet: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  hiIQBalance: PropTypes.number.isRequired
};

export default memo(LockStats);
