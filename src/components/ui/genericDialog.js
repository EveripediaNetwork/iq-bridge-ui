import React from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";

const GenericDialog = ({ size, title, body, ...props }) => {
  return (
    <Modal size={size} centered className="rounded" {...props}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
    </Modal>
  );
};

GenericDialog.propTypes = {
  size: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.node.isRequired
};

export default GenericDialog;
