import React, { memo } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import Layout from "../../components/layouts/layout";
import CardTitle from "../../components/ui/cardTitle";
import useTitle from "../../hooks/useTitle";

const DataTitle = styled.div`
  font-size: 20px;
  border-bottom: 1px solid #ecebeb;
  margin: 20px 5px 5px 5px;
  text-transform: capitalize;
`;

const Treasury = () => {
  useTitle("Treasury");
  return (
    <Layout>
      <Container className="mt-3" fluid>
        <Row>
          <Col>
            <CardTitle
              title="Treasury"
              role="img"
              aria-label="raffles"
              className="brain"
              icon="🖼"
            />
            <Card className="mx-auto shadow-sm">
              <Card.Body>
                <b>NFT BrainDAO Collection</b>
              </Card.Body>
            </Card>
            <br />
            <Card className="mx-auto shadow-sm">
              <Card.Body>
                <div>
                  <a
                    rel="noreferrer"
                    href="https://opensea.io/assets/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/9665"
                    target="_blank"
                  >
                    <img
                      alt="BrainApe"
                      width="100%"
                      src="https://img.seadn.io/files/2c89f7606a12b04b100bb89915b6c331.png?auto=format&w=600"
                    />
                  </a>
                </div>
                <DataTitle className="text-sm-center">
                  <a
                    rel="noreferrer"
                    href="https://opensea.io/assets/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/9665"
                    target="_blank"
                  >
                    BAYC #9665
                  </a>
                </DataTitle>
              </Card.Body>
            </Card>
            <br />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default memo(Treasury);
