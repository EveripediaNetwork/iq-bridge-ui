import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { ListGroup, Button, Col, Row } from "react-bootstrap";
import { BarChartLineFill } from "react-bootstrap-icons";

import { ethBasedExplorerUrl } from "../../config";
import GenericDialog from "./genericDialog";

const Link = styled.a`
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const VoteBreakdown = ({ votes, choices }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="d-flex my-2 flex-column justify-content-center">
      <GenericDialog
        show={open}
        onHide={() => setOpen(false)}
        size="md"
        title="Votes Breakdown"
        body={
          <ListGroup>
            {votes.map(v => (
              <ListGroup.Item key={v.voter}>
                <Row className="d-flex flex-row flex-wrap justify-content-between">
                  <Col
                    sm={5}
                    className="text-center"
                    style={{
                      maxWidth: "150px !imporant",
                      width: "150px !important",
                      minWidth: "150px !important"
                    }}
                  >
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-uppercase"
                      href={`${ethBasedExplorerUrl}address/${v.voter}`}
                    >
                      {`${v.voter.match(/.{1,20}/g)[0]}...`}
                    </Link>
                  </Col>
                  <Col sm className="text-center">
                    <strong>{choices[v.choice - 1]}</strong>
                  </Col>
                  <Col sm className="text-center">
                    {v.power && <span>{v.power.toFixed(2)} IQ</span>}
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        }
      />
      <div className="text-center">
        <Button
          active
          variant="light"
          className="align-middle"
          onClick={() => setOpen(true)}
        >
          <span className="mr-2">Votes Breakdown</span>
          <BarChartLineFill className="mb-2" />
        </Button>
      </div>
    </div>
  );
};

VoteBreakdown.propTypes = {
  votes: PropTypes.arrayOf(PropTypes.object).isRequired, // eslint-disable-line react/forbid-prop-types
  choices: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default VoteBreakdown;
