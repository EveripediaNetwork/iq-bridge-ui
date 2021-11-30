import React, { memo } from "react";
import { Button, Overlay, Tooltip } from "react-bootstrap";
import { QuestionCircle } from "react-bootstrap-icons";
import PropTypes from "prop-types";

const GenericOverlay = ({ show, setShow, target, tooltipText }) => (
  <>
    <Button
      variant="light"
      size="sm"
      className="ml-2"
      ref={target}
      onClick={event => {
        event.preventDefault();
        setShow(!show);
      }}
    >
      <QuestionCircle />
    </Button>
    <Overlay
      style={{
        display: show ? "block" : "none"
      }}
      target={target.current}
      show={show}
      placement="bottom"
    >
      {props => <Tooltip {...props}>{tooltipText}</Tooltip>}
    </Overlay>
  </>
);

GenericOverlay.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  target: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  tooltipText: PropTypes.string.isRequired
};

export default memo(GenericOverlay);
