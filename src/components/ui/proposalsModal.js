import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ListGroup,
  Button,
  Spinner,
  Container,
  Col,
  Row,
  Accordion,
  useAccordionToggle,
  AccordionContext
} from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import ReactMarkdown from "react-markdown";

import { snapshotBaseUrl } from "../../config";
import { getProposals } from "../../utils/SnapshotProvider";
import { ProposalContext } from "../../context/proposalContext";

const StyledModal = styled(Modal)`
  max-height: 100vh;
`;

const ProposalsModal = ({ setShow, ...props }) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const [showProposalAtIndex, setShowProposalAtIndex] = useState();
  const [headerText, setHeaderText] = useState("Current proposals");
  const { proposals, setProposals, setSelectedProposal } =
    useContext(ProposalContext);

  const chunkString = str =>
    str.length > 25 ? `${str.match(/.{1,25}/g)[0]}...` : str;

  const handleShowDetailsClick = index => {
    setShowDetails(true);
    setShowProposalAtIndex(index);
    setHeaderText(t("details"));
  };

  const handleGoBack = () => {
    setShowDetails(false);
    setShowProposalAtIndex(undefined);
    setHeaderText(t("current_proposals"));
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
        {isCurrentEventKey ? "Close details" : "Open details"}
      </Button>
    );
  };

  const handleSelectProposalForVoting = () => {
    setShow(false);
    setSelectedProposal(proposals[showProposalAtIndex]);
  };

  useEffect(() => {
    if (props.show === true && !proposals)
      (async () => {
        const data = await getProposals();
        setProposals(data);
      })();
  }, [props.show]);

  return (
    <StyledModal {...props} size="md" centered className="rounded">
      <Modal.Header closeButton className="px-3 py-2">
        <Modal.Title className="w-100 d-flex flex-row justify-content-between">
          {showDetails && (
            <Button onClick={handleGoBack} variant="light" size="small">
              <ArrowLeft />
            </Button>
          )}
          {!showDetails && <h4>{headerText}</h4>}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-3 py-2">
        {!showDetails ? (
          <ListGroup variant="flush">
            {proposals ? (
              proposals.map((pro, index) => (
                <ListGroup.Item
                  key={pro.id}
                  onClick={() => handleShowDetailsClick(index)}
                  action
                  className="p-2 d-flex flex-row justify-content-between"
                >
                  {chunkString(pro.title)}
                  <Button
                    onClick={() => handleShowDetailsClick(index)}
                    size="sm"
                    variant="light"
                  >
                    {t("details")}
                  </Button>
                </ListGroup.Item>
              ))
            ) : (
              <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="grow" />
              </div>
            )}
          </ListGroup>
        ) : (
          <div>
            <h4 className="text-center text-info">
              {proposals[showProposalAtIndex].title}
            </h4>
            <Container className="shadow-sm p-3">
              <Row>
                <Col xs>
                  <strong>{t("start")}: </strong>
                  {new Date(
                    proposals[showProposalAtIndex].start * 1000
                  ).toLocaleDateString("en-US")}
                  <br />
                  <small className="text-muted">
                    <strong>{t("at")}: </strong>
                    {new Date(
                      proposals[showProposalAtIndex].start * 1000
                    ).toLocaleTimeString()}
                  </small>
                </Col>
                <Col xs>
                  <strong>{t("end")}: </strong>
                  {new Date(
                    proposals[showProposalAtIndex].end * 1000
                  ).toLocaleDateString()}
                  <br />
                  <small className="text-muted">
                    <strong>{t("at")}: </strong>
                    {new Date(
                      proposals[showProposalAtIndex].end * 1000
                    ).toLocaleTimeString()}
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
                <ReactMarkdown>
                  {proposals[showProposalAtIndex].body}
                </ReactMarkdown>
              </Accordion.Collapse>
            </Accordion>
            <hr />
            <div className="text-center">
              <Button variant="warning" onClick={handleSelectProposalForVoting}>
                {t("select_for_voting")}
              </Button>
              <Button variant="light">
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`${snapshotBaseUrl}${proposals[showProposalAtIndex].id}`}
                >
                  {t("see_on_snapshot")}
                </a>
              </Button>
            </div>
          </div>
        )}
      </Modal.Body>
    </StyledModal>
  );
};

ProposalsModal.propTypes = {
  setShow: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
};

export default ProposalsModal;
