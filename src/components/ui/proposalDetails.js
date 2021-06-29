import React, { useContext } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  Accordion,
  useAccordionToggle,
  AccordionContext,
  Button
} from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";

import { ProposalContext } from "../../context/proposalContext";
import { snapthotSpaceUrl } from "../../config";

const ProposalDetails = ({ proposal, setShow }) => {
  const { t } = useTranslation();
  const { selectedProposal, setSelectedProposal } = useContext(ProposalContext);

  const handleSelectProposalForVoting = () => {
    // eslint-disable-next-line no-unused-expressions
    selectedProposal !== undefined
      ? setSelectedProposal(undefined)
      : setSelectedProposal(proposal);

    setShow();
  };

  // eslint-disable-next-line react/prop-types
  const ToggleButton = ({ eventKey, callback }) => {
    const currentEventKey = useContext(AccordionContext);
    const customizeOnClick = useAccordionToggle(
      eventKey,
      () => callback && callback(eventKey)
    );

    const isCurrentEventKey = currentEventKey === eventKey;

    return (
      <Button onClick={customizeOnClick} variant="light">
        {isCurrentEventKey ? t("close_details") : t("open_details")}
      </Button>
    );
  };

  return (
    <div>
      <h4 className="text-center font-weight-light text-primary">
        {proposal.title}
      </h4>
      <Container className="shadow-sm p-3">
        <Row>
          <Col xs>
            <strong>{t("started")}: </strong>
            {new Date(proposal.start * 1000).toLocaleDateString("en-US")}
            <br />
            <small className="text-muted">
              <strong>{t("at")}: </strong>
              {new Date(proposal.start * 1000).toLocaleTimeString()}
            </small>
          </Col>
          <Col xs>
            <strong>
              {proposal.state === "closed" ? t("ended") : t("ending")}:{" "}
            </strong>
            {new Date(proposal.end * 1000).toLocaleDateString()}
            <br />
            <small className="text-muted">
              <strong>{t("at")}: </strong>
              {new Date(proposal.end * 1000).toLocaleTimeString()}
            </small>
          </Col>
        </Row>
      </Container>
      <hr />
      <Accordion>
        <div className="d-flex flex-row justify-content-center">
          <ToggleButton eventKey="0" />
        </div>
        <Accordion.Collapse eventKey="0">
          <ReactMarkdown>{proposal.body}</ReactMarkdown>
        </Accordion.Collapse>
      </Accordion>
      <hr />
      <div className="text-center">
        <Button
          variant={selectedProposal ? "success" : "warning"}
          onClick={handleSelectProposalForVoting}
        >
          {selectedProposal ? t("selected") : t("select_for_voting")}
        </Button>
        <Button variant="light">
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={`${snapthotSpaceUrl}`}
          >
            {t("see_on_snapshot")}
          </a>
        </Button>
      </div>
    </div>
  );
};

ProposalDetails.propTypes = {
  proposal: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  setShow: PropTypes.func
};

ProposalDetails.defaultProps = {
  setShow: () => {}
};

export default ProposalDetails;
