import React, { memo, useState, lazy } from "react";
import { Card, Button, Tab, Tabs } from "react-bootstrap";
import styled from "styled-components";

import GaugesVotesBreakdownDialog from "../../components/ui/gaugesVotesBreakdownDialog";

const GaugesList = lazy(() => import("./gaugesList"));

const StyledCard = styled(Card)`
  padding: 10px;
  margin: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const VotingHistory = () => {
  const [showVotesBreakdown, setShowVotesBreakdown] = useState(false);
  const [keyTab, setKeyTab] = useState("last-week");
  const [activeIndex, setActiveIndex] = useState(0);

  const TabBody = () => (
    <>
      <GaugesList activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center">
        <Button variant="success mb-2" size="sm">
          My votes
        </Button>
        <h5>Voted this week</h5>
        <span className="monospace">549,345,433 IQ</span>
        <span>
          <span className="monospace font-weight-bold">34%</span> of HiIQ supply
          voted
        </span>

        <Button
          onClick={() => setShowVotesBreakdown(!showVotesBreakdown)}
          variant="info"
          className="mt-2"
          size="sm"
        >
          <strong>Breakdown</strong>
        </Button>
      </div>
    </>
  );

  return (
    <StyledCard style={{ width: 330 }}>
      <Card.Title>Voting history</Card.Title>
      <Card.Body className="p-0 w-100">
        <Tabs activeKey={keyTab} onSelect={k => setKeyTab(k)}>
          <Tab
            eventKey="last-week"
            title="Last week"
            onClick={event => event.preventDefault()}
          >
            {TabBody()}
          </Tab>
          <Tab
            eventKey="this-week"
            title="This week"
            onClick={event => event.preventDefault()}
          >
            {TabBody()}
          </Tab>
        </Tabs>
      </Card.Body>
      <GaugesVotesBreakdownDialog
        show={showVotesBreakdown}
        setShow={setShowVotesBreakdown}
      />
    </StyledCard>
  );
};

export default memo(VotingHistory);
