import React from "react";
import PropTypes from "prop-types";
import { Modal, Button, Alert, ListGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

import { ethBasedExplorerUrl } from "../../config";

const TxDetailsDialog = ({ hashes, ...props }) => {
  const { t } = useTranslation();

  const chunkString = stringToChunk =>
    `${stringToChunk.match(/.{1,20}/g)[0]}...`;

  return (
    <Modal {...props} size="sm" centered>
      <Modal.Header closeButton className="px-3 py-2">
        <Modal.Title className="font-weight-light">
          {t("transactions")}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pb-0">
        <ListGroup
          style={{ maxWidth: 250 }}
          className="d-flex mx-auto flex-column justify-content-start"
        >
          {hashes.map(hash => (
            <ListGroup.Item
              key={hash}
              className="d-flex flex-row justify-content-center"
            >
              <p className="m-0">{chunkString(hash)}</p>
              <Button size="sm" className="pt-0 ml-1" variant="light">
                <a
                  target="_blank"
                  href={`${ethBasedExplorerUrl}tx/${hash}`}
                  rel="noopener noreferrer"
                >
                  <Search />
                </a>
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className="d-flex flex-row mt-1 justify-content-center">
          <Alert variant="light" className="p-0 font-italic text-center">
            {t("txAlert")}
          </Alert>
        </div>
      </Modal.Body>
    </Modal>
  );
};

TxDetailsDialog.propTypes = {
  hashes: PropTypes.array.isRequired
};

export default TxDetailsDialog;
