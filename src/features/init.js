import React, { memo } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Layout from "../components/layouts/layout";
import CardTitle from "../components/ui/cardTitle";

const CardLinks = styled(Card)`
  border: 0px !important;
  text-align: center;

  a {
    font-size: 60px;

    :hover {
      text-decoration: none;
    }
  }
`;

const Init = () => {
  return (
    <Layout>
      <Container className="mt-3" fluid>
        <Row>
          <Col>
            <CardTitle title="IQ" aria-label="brain" icon="🧠" />
            <Card className="mx-auto shadow-sm">
              <Card.Body>
                <p>
                  The 🧠 IQ token is a multichain token that powers the
                  Everipedia ecosystem of dapps and features! Read the docs
                  (link) for the technical specs.
                  <br />
                  <br />
                  <Link to="/bridge">Bridge</Link> your token from all chains IQ
                  circulates on using our bridge UI. IQ is multichain.
                  <br />
                  <br />
                  IQ is a DeFi token that can be{" "}
                  <Link to="/lock">staked for hiIQ</Link> to earn rewards+yield.
                  NFT giveaways to hiIQ stakers and new features soon.
                  <br />
                  <br />
                  Check the <Link to="/stats">stats</Link> page for a
                  comprehensive, global look at IQ holders, market
                  capitalization, and more.
                  <br />
                  <br />
                  Other features such as <Link to="/voting">voting</Link> for
                  new staking features coming soon!
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <CardLinks className="mx-auto">
              <Card.Body>
                <Link alt="Bridge" title="Bridge" to="/bridge">
                  🌉
                </Link>{" "}
                |{" "}
                <Link alt="Lock" title="Lock" to="/lock">
                  🔒
                </Link>{" "}
                |{" "}
                <Link alt="Stats" title="Stats" to="/stats">
                  📊
                </Link>
              </Card.Body>
            </CardLinks>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default memo(Init);
