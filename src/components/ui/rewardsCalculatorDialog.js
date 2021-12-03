import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Form, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import * as Humanize from "humanize-plus";
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

const StyledButton = styled(Button)`
  border: 1px dashed lightblue !important;
`;

const RewardsCalculatorDialog = ({
  openRewardsCalculator,
  setOpenRewardsCalculator,
  hiIQSupply,
  rewardsAcrossLockPeriod
}) => {
  const { t } = useTranslation();
  const [inputIQ, setInputIQ] = useState();
  const [years, setYears] = useState();
  const [aprDividedByLockPeriod, setAprDividedByLockPeriod] = useState();
  const [expectedIQ, setExpectedIQ] = useState();
  const lockedIQRef = useRef(null);
  const yearsRef = useRef(null);

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

      let percentage = 100;
      if (years < 1) percentage = years * 100;

      setAprDividedByLockPeriod((aprAcrossLockPeriod / years) * percentage);
    }
  }, [inputIQ, years]);

  const handleLockedIQInput = e => {
    const value = Number(e.target.value);
    if (value < 0) lockedIQRef.current.value = "";
    else setInputIQ(value);
  };

  const handleYearsInput = value => {
    yearsRef.current.value = value;

    if (value < 0 || value > 4) yearsRef.current.value = "";
    else setYears(value);
  };

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
                {t("supply")} <br />
                <strong>
                  {Humanize.intComma(Number(hiIQSupply).toFixed(0))} hiiq
                </strong>
              </p>
            </div>
          ) : null}
          <StyledFormControl
            type="number"
            ref={lockedIQRef}
            min="0"
            onChange={handleLockedIQInput}
            placeholder={t("locked_iq")}
            className="mb-2"
          />
          <StyledFormControl
            type="number"
            min="0"
            max="4"
            ref={yearsRef}
            onChange={event => handleYearsInput(Number(event.target.value))}
            placeholder={`${t("years")} (4 years max)`}
          />
          <div className="d-flex flex-row justify-content-center p-2">
            <StyledButton
              onClick={() => handleYearsInput(0.0833334)}
              size="sm"
              variant="light"
              className="m-1 shadow-sm"
            >
              1 month
            </StyledButton>
            <StyledButton
              onClick={() => handleYearsInput(0.25)}
              size="sm"
              variant="light"
              className="m-1 shadow-sm"
            >
              3 months
            </StyledButton>
            <StyledButton
              onClick={() => handleYearsInput(0.500001)}
              size="sm"
              variant="light"
              className="m-1 shadow-sm"
            >
              6 months
            </StyledButton>
          </div>

          <StyledDivContainer className="shadow-sm">
            <p className="mb-0">
              {" "}
              {t("you_will_get")}:{" "}
              <strong>
                {expectedIQ ? Number(expectedIQ).toFixed(2) : 0} IQ
              </strong>
            </p>
            <p className="mb-0">
              {" "}
              {t("expected_apr")}:{" "}
              <strong>
                {aprDividedByLockPeriod
                  ? Number(aprDividedByLockPeriod).toFixed(2)
                  : 0}{" "}
                %
              </strong>
            </p>
          </StyledDivContainer>
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
