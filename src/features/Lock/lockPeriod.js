import React, { memo, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { useFormContext } from "react-hook-form";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import InputSpinner from "react-bootstrap-input-spinner";

const LockValueInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 0.4px dashed lightgray;
  align-items: center;
  margin-bottom: 15px;
  ${props =>
    props.radioValue === 1 &&
    props.currentHIIQ > 0 &&
    css`
      -webkit-filter: blur(5px);
      -moz-filter: blur(5px);
      -o-filter: blur(5px);
      -ms-filter: blur(5px);
      filter: blur(5px);
      background-color: #ccc;
    `}
`;

const SelectedLockValueText = styled.span`
  font-size: 14px;
  font-weight: normal;
  color: #aeabab;
  margin-bottom: 10px;
  text-transform: capitalize;
`;

const StyledInputSpinner = styled(InputSpinner)`
  input-group-append > input.form-control {
    text-align: center !important;
  }
`;

const LockPeriod = ({
  wallet,
  updateParentLockValue,
  radioValue,
  filledAmount,
  currentHIIQ,
  maximumLockableTime
}) => {
  const { t } = useTranslation();
  const { register } = useFormContext();
  const [lockValue, setLockValue] = useState();
  const [remaining, setRemaining] = useState();
  const inputRef = useRef();

  useEffect(() => {
    setLockValue(0);

    if (inputRef && inputRef.current) inputRef.current.state.value = 0;

    if (maximumLockableTime) {
      const weeks = Number(maximumLockableTime / 7);

      if (weeks < 1) setRemaining(0);
      else setRemaining(Number(weeks).toFixed());
    }
  }, [maximumLockableTime]);

  const handleOnInputLockValue = num => {
    const value = num * 7; // multiply weeks with days

    setLockValue(num);
    updateParentLockValue(value);
  };

  const handleOnSliderChange = num => {
    const value = num * 7; // multiply weeks with days

    if (lockValue > num && lockValue - num > 1 && num !== 0)
      updateParentLockValue(value + (lockValue - num) * 7);
    else updateParentLockValue(value);

    if (inputRef && inputRef.current) inputRef.current.state.value = num;

    setLockValue(num);
  };

  return (
    <LockValueInfoContainer
      radioValue={radioValue}
      currentHIIQ={currentHIIQ}
      className="rounded pr-3 pl-3 pt-2 pb-3"
    >
      {maximumLockableTime && maximumLockableTime > 0 ? (
        <small className="text-center w-100 p-0 container">
          {t("value_restriction")}{" "}
          <strong>
            {!lockValue ? remaining : remaining - lockValue}
            {t("weeks")}
          </strong>
        </small>
      ) : null}
      <br />
      <div className="d-flex flex-row w-100 justify-content-center">
        <SelectedLockValueText>{t("lock_period")}</SelectedLockValueText>
      </div>
      <Container>
        <Row className="d-flex flex-row justify-content-center align-items-between flex-wrap">
          <Col
            className="d-flex flex-column justify-content-center mt-3"
            xs={12}
            sm={12}
            md={7}
            lg={7}
          >
            <Slider
              disabled={
                wallet.account === null ||
                (radioValue === 1 && currentHIIQ && currentHIIQ !== 0) ||
                (radioValue === 1 && (!filledAmount || filledAmount === 0)) ||
                remaining === 0
              }
              railStyle={{ backgroundColor: "lightgray", height: 11 }}
              trackStyle={{ height: 14 }}
              handleStyle={{
                borderColor: "black",
                height: 22,
                width: 22
              }}
              ref={e => {
                register(e, { required: false });
              }}
              onChange={handleOnSliderChange}
              value={lockValue}
              max={remaining || 208}
              step={1}
            />
          </Col>
          <Col
            style={{ minWidth: 100 }}
            xs={12}
            sm={12}
            md={3}
            lg={3}
            className="mt-3 p-0"
          >
            <StyledInputSpinner
              type="real"
              precision={0}
              disabled={
                wallet.account === null ||
                (radioValue === 1 && currentHIIQ && currentHIIQ !== 0) ||
                (radioValue === 1 && (!filledAmount || filledAmount === 0)) ||
                remaining === 0
              }
              max={remaining || 208}
              min={0}
              step={1}
              value={lockValue || 0}
              ref={e => {
                register(e, { required: false });

                inputRef.current = e;
              }}
              onChange={num => handleOnInputLockValue(num)}
              className="text-right min-w-100 w-100"
              variant="primary"
              size="sm"
            />
          </Col>
        </Row>
      </Container>
    </LockValueInfoContainer>
  );
};

LockPeriod.propTypes = {
  wallet: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  updateParentLockValue: PropTypes.func.isRequired,
  radioValue: PropTypes.number.isRequired,
  filledAmount: PropTypes.number.isRequired,
  currentHIIQ: PropTypes.number, // eslint-disable-line react/require-default-props
  maximumLockableTime: PropTypes.number // eslint-disable-line react/require-default-props
};

export default memo(LockPeriod);
