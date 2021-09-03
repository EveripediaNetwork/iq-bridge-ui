import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";
import styled from "styled-components";

import GenericDialog from "./genericDialog";

const StyledDivContainer = styled.div`
  border: 1px dashed lightgray;
  background-color: #f7f7f7;
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
`;

const StyledFormControl = styled(Form.Control)`
  :focus {
    box-shadow: none !important;
  }
  border-radius: 5px !important;
`;

const RewardsCalculatorDialog = ({
  openRewardsCalculator,
  setOpenRewardsCalculator,
  hiIQSupply,
  rewardsAcrossLockPeriod
}) => {
  const [inputIQ, setInputIQ] = useState();
  const [years, setYears] = useState();
  const [aprDividedByLockPeriod, setAprDividedByLockPeriod] = useState();
  const [expectedIQ, setExpectedIQ] = useState();

  const handleOnHide = () => {
    setYears();
    setInputIQ();
    setAprDividedByLockPeriod();
    setExpectedIQ();
    setOpenRewardsCalculator(false);
  };

  useEffect(() => {
    if (inputIQ && years) {
      const rewardsBasedOnLockPeriod = inputIQ * (1 + 0.75 * years);

      const poolRatio =
        rewardsBasedOnLockPeriod / (hiIQSupply + rewardsBasedOnLockPeriod);

      const userRewardsAtTheEndOfLockPeriod =
        rewardsAcrossLockPeriod * years * poolRatio;

      const userRewardsPlusInitialLock =
        userRewardsAtTheEndOfLockPeriod + inputIQ;

      setExpectedIQ(userRewardsPlusInitialLock);

      const aprAcrossLockPeriod = userRewardsPlusInitialLock / inputIQ;

      setAprDividedByLockPeriod((aprAcrossLockPeriod / years) * 100);
    }
  }, [inputIQ, years]);

  return (
    <GenericDialog
      size="sm"
      title="Rewards Calculator"
      show={openRewardsCalculator}
      onHide={handleOnHide}
      body={
        <Form className="d-flex flex-column justify-content-evenly">
          {hiIQSupply ? (
            <div className="mb-2">
              <p className="mb-0 text-center text-uppercase">
                {" "}
                supply <br />
                <strong>{Number(hiIQSupply).toFixed(0)} hiiq</strong>
              </p>
            </div>
          ) : null}
          <StyledFormControl
            type="number"
            onChange={event => setInputIQ(event.target.value)}
            placeholder="Locked IQ"
            className="mb-2"
          />
          <StyledFormControl
            type="number"
            max="4"
            onChange={event => setYears(event.target.value)}
            placeholder="Years"
          />
          {inputIQ && years && aprDividedByLockPeriod ? (
            <StyledDivContainer className="shadow-sm">
              <p className="mb-0">
                {" "}
                You will get:{" "}
                <strong>{Number(expectedIQ).toFixed(2)} IQ</strong>
              </p>
              <p className="mb-0">
                {" "}
                Expected APR:{" "}
                <strong>{Number(aprDividedByLockPeriod).toFixed(2)} %</strong>
              </p>
            </StyledDivContainer>
          ) : null}
        </Form>
      }
    />
  );
};

RewardsCalculatorDialog.propTypes = {
  openRewardsCalculator: PropTypes.bool.isRequired,
  setOpenRewardsCalculator: PropTypes.func.isRequired,
  hiIQSupply: PropTypes.number.isRequired,
  rewardsAcrossLockPeriod: PropTypes.number.isRequired
};

export default RewardsCalculatorDialog;
