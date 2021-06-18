import React, { useState } from "react";
import PropTypes from "prop-types";
import { ListGroup, Button } from "react-bootstrap";
import { BarChartLineFill } from "react-bootstrap-icons";

import GenericDialog from "./genericDialog";

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
              <ListGroup.Item
                className="d-flex flex-row justify-content-between"
                key={v}
              >
                <span>{`${v.voter.match(/.{1,25}/g)[0]}...`}</span>
                <span>{choices[v.choice - 1]}</span>
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
