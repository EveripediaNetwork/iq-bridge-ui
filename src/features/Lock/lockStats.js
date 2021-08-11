import React, { memo, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import PropTypes from "prop-types";

import { getStats } from "../../utils/EthDataProvider/EthDataProvider";
// import GenericDialog from "../../components/ui/genericDialog";

const LockStats = ({ wallet, hiIQBalance }) => {
  const [stats, setStats] = useState();
  // const [open, setOpen] = useState(false);
  useEffect(() => {
    (async () => {
      const { supply, tvl } = await getStats(wallet);
      setStats({
        apr:
          hiIQBalance && hiIQBalance !== 0
            ? Number((hiIQBalance / supply) * 365 * 100).toFixed(2)
            : 0,
        tvl
      });
    })();
  }, [wallet]);

  return (
    <Card style={{ width: 330 }} className="shadow">
      <Card.Body>
        <h3 className="text-center font-weight-light">Lock stats</h3>
        <hr className="shadow" />
        {stats !== undefined ? (
          <div className="container">
            {stats.apr ? (
              <p className="m-0">
                {" "}
                <strong>Your APR: </strong>
                <span>{stats.apr}%</span>
              </p>
            ) : null}
            <p className="m-0">
              {" "}
              <strong>Unclaimed Rewards: </strong>
              <span>
                {7000000 - stats.tvl} <strong>HIIQ</strong>
              </span>
            </p>
            <p className="m-0">
              {" "}
              <strong>TVL: </strong>
              <span>{stats.tvl} IQ</span>
            </p>
            {/* <div className="container mt-1 text-center">
              <Button onClick={() => setOpen(true)} size="sm" variant="info">
                Distribution history
              </Button>
            </div> */}
          </div>
        ) : null}
      </Card.Body>
      {/* <GenericDialog
        show={open}
        onHide={() => setOpen(false)}
        size="md"
        title={"Weekly distribution"}
        body={
          <Table striped bordered hover size="sm">
            <thead>
              <tr className="text-center">
                <th>Week</th>
                <th>Rewards</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mark</td>
                <td>Otto</td>
              </tr>
              <tr>
                <td>Jacob</td>
                <td>Thornton</td>
              </tr>
            </tbody>
          </Table>
        }
      /> */}
    </Card>
  );
};

LockStats.propTypes = {
  wallet: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  hiIQBalance: PropTypes.number.isRequired
};

export default memo(LockStats);
