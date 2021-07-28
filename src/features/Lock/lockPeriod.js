import React, { memo, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
// import { useTranslation } from "react-i18next";
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
  currentHIIQ,
  maximumLockableTime
}) => {
  // const { t } = useTranslation();
  const [lockValue, setLockValue] = useState();
  const [remaining, setRemaining] = useState();
  const inputRef = useRef();

  useEffect(() => {
    if (maximumLockableTime) {
      const weeks = Number(maximumLockableTime / 7).toFixed(0);
      setRemaining(weeks);
    }
  }, [maximumLockableTime]);

  const handleOnInputLockValue = num => {
    const value = num * 7; // multiply weeks with days

    setLockValue(num);
    updateParentLockValue(value);
  };

  const handleOnSliderChange = value => {
    setLockValue(value);
    inputRef.current.state.value = value;

    updateParentLockValue(Number(value) * 7); // multiply weeks with days
  };

  return (
    <LockValueInfoContainer className="rounded pr-3 pl-3 pt-2 pb-3">
      {maximumLockableTime && maximumLockableTime > 0 ? (
        <small className="text-center w-100 p-0 container">
          You can increase the lock time for a maximum of{" "}
          <strong>
            {!lockValue ? remaining : remaining - lockValue} weeks
          </strong>
        </small>
      ) : null}
      <br />
      <div className="d-flex flex-row w-100 justify-content-end">
        <SelectedLockValueText>Lock Period (weeks)</SelectedLockValueText>
      </div>
      <Container>
        <Row>
          <Col className="d-flex flex-column justify-content-center" xs={9}>
            <Slider
              disabled={
                wallet.account === null ||
                (radioValue === 1 && currentHIIQ && currentHIIQ !== 0)
              }
              railStyle={{ backgroundColor: "lightgray", height: 11 }}
              trackStyle={{ height: 14 }}
              handleStyle={{
                borderColor: "black",
                height: 22,
                width: 22
              }}
              onChange={handleOnSliderChange}
              className="mb-3"
              min={1}
              value={lockValue}
              max={remaining || 209}
              step={1}
            />
          </Col>
          <Col className="p-0">
            <StyledInputSpinner
              type="real"
              precision={0}
              disabled={
                wallet.account === null ||
                (radioValue === 1 && currentHIIQ && currentHIIQ !== 0)
              }
              max={remaining || 209}
              min={1}
              step={1}
              value={lockValue || 0}
              ref={e => {
                inputRef.current = e;
              }}
              onChange={num => handleOnInputLockValue(num)}
              className="text-right"
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
  currentHIIQ: PropTypes.number, // eslint-disable-line react/require-default-props
  maximumLockableTime: PropTypes.number // eslint-disable-line react/require-default-props
};

export default memo(LockPeriod);
