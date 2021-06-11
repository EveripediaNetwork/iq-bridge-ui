import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Modal, ListGroup, Button, Spinner } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import ReactMarkdown from "react-markdown";

import { snapshotBaseUrl } from "../../config";
import { getProposals } from "../../utils/SnapshotProvider";
import { ProposalContext } from "../../context/proposalContext";

const ProposalsModal = ({ ...props }) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const [showProposalAtIndex, setShowProposalAtIndex] = useState();
  const [headerText, setHeaderText] = useState("Current proposals");
  const { proposals, setProposals } = useContext(ProposalContext);

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

  useEffect(() => {
    if (props.show === true && !proposals)
      (async () => {
        const data = await getProposals();
        setProposals(data);
      })();
  }, [props.show]);

  return (
    <Modal {...props} size="md" centered className="rounded">
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
            <hr />
            <ReactMarkdown>{proposals[showProposalAtIndex].body}</ReactMarkdown>
            <div className="text-center">
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
    </Modal>
  );
};

ProposalsModal.propTypes = {
  show: PropTypes.bool.isRequired
};

export default ProposalsModal;
