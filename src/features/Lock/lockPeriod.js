import React, { memo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Form, Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

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

const InputLockValue = styled(Form.Control)`
  :focus {
    box-shadow: none !important;
  }
`;

const InputErrorText = styled(Form.Text)`
  color: red;
  font-style: italic;
  font-weight: bold;
`;

const LockPeriod = ({ wallet, updateParentLockValue }) => {
  const { t } = useTranslation();
  const [lockValue, setLockValue] = useState(7);
  const [validInput, setValidInput] = useState(undefined);

  const validnum = a => a >= 1 && a <= 1460;

  useEffect(() => setValidInput(validnum(lockValue)), [lockValue]);

  const handleOnInputLockValue = event => {
    const value = Number(event.target.value);

    if (validnum(value)) {
      setLockValue(value);
      updateParentLockValue(value);
      setValidInput(true);
    } else {
      setLockValue(0);
      updateParentLockValue(0);
      setValidInput(false);
    }
  };

  const handleOnSliderChange = value => {
    setLockValue(value);
    updateParentLockValue(value);
  };

  return (
    <LockValueInfoContainer className="rounded pr-3 pl-3 pt-2 pb-3">
      <div className="d-flex flex-row w-100 justify-content-end">
        <SelectedLockValueText>{t("lock_period")}</SelectedLockValueText>
      </div>
      <Container>
        <Row>
          <Col className="d-flex flex-column justify-content-center" xs={9}>
            <Slider
              disabled={wallet.account === null}
              railStyle={{ backgroundColor: "lightgray", height: 11 }}
              trackStyle={{ height: 14 }}
              handleStyle={{
                borderColor: "black",
                height: 22,
                width: 22
              }}
              onChange={handleOnSliderChange}
              className="mb-3"
              value={lockValue}
              min={1}
              max={1460}
              step={1}
            />
          </Col>
          <Col className="p-0">
            <InputLockValue
              disabled={wallet.account === null}
              value={lockValue}
              className="text-center"
              type="number"
              onChange={handleOnInputLockValue}
            />
          </Col>
        </Row>
        {validInput && validInput === false && (
          <Row>
            <Col className="d-flex flex-column justify-content-center">
              <InputErrorText className="text-center">
                {t("value_restriction")}
              </InputErrorText>
            </Col>
          </Row>
        )}
      </Container>
    </LockValueInfoContainer>
  );
};

LockPeriod.propTypes = {
  wallet: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  updateParentLockValue: PropTypes.func.isRequired
};

export default memo(LockPeriod);
