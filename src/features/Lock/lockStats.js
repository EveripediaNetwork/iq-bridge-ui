import React, { memo } from "react";
import { Card, Button } from "react-bootstrap";

const LockStats = () => {
  return (
    <Card style={{ width: 220 }} className="shadow m-auto p-1">
      <Card.Body className="p-1">
        <h3 className="text-center font-weight-normal">Rewards</h3>
        <hr className="shadow" />
        <div className="container">
          <>
            <p className="m-0 text-center">
              {" "}
              <strong>Updating Reward contract...</strong>
              <br />
            </p>
            <hr className="shadow" />
          </>
          <>
            <p className="m-0 text-center font-weight-light">
              Rewards will be distributed to stakers and new contract will be up
              this week.
              <br />
            </p>
            <hr className="shadow" />
          </>

          <div className="container mt-4 text-center">
            <Button disabled size="sm" variant="success">
              Claim rewards
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default memo(LockStats);
