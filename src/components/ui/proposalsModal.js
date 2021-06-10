import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal, ListGroup, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { getProposals } from "../../utils/SnapshotProvider";
import { ProposalContext } from "../../context/proposalContext";

const ProposalsModal = ({ ...props }) => {
  const { proposals, setProposals, selectedProposal, setSelectedPropsal } =
    useContext(ProposalContext);

  const chunkString = str =>
    str.length > 35 ? str.match(/.{1,25}/g)[0] + "..." : str;

  useEffect(() => {
    (async () => {
      const data = await getProposals();
      setProposals(data);
    })();
  }, []);

  return (
    <Modal {...props} size="lg" centered className="rounded">
      <Modal.Header closeButton className="px-3 py-2">
        <Modal.Title>Current proposals</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-3 py-2">
        <ListGroup variant="flush">
          {proposals &&
            proposals.map(pro => (
              <ListGroup.Item
                action
                className="p-2 d-flex flex-row justify-content-between"
              >
                {chunkString(pro.title)}
                <Button size="sm" variant="light">
                  Details
                </Button>
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default ProposalsModal;
