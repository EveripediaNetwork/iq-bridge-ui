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

const DataRow = styled.div`
  content: "";
  display: table;
  clear: both;
  width: 100%;
  font-size: 11px;
  margin-bottom: 4px;
`;

const Icon = styled.div`
  img {
    width: 23px;
  }

  float: left;
  width: 8%;
`;

const Title = styled.div`
  padding-left: 2px;
  float: left;
  width: 62%;
`;

const Value = styled.div`
  float: right;
  width: 30%;
  text-align: right;
`;

const Raffles = () => {
  useTitle("Raffles");
  return (
    <Layout>
      <Container className="mt-3" fluid>
        <Row>
          <Col>
            <CardTitle
              title="IQ Raffles"
              role="img"
              aria-label="raffles"
              className="brain"
              icon="🎫"
            />
            <Card className="mx-auto shadow-sm">
              <Card.Body>
                <DataTitle className="d-flex flex-row justify-content-between">
                  <a href="https://opensea.io/collection/juicy-js-journey-nft-drop" target="_blank">Juicy J&apos;s
                    Journey NFT Drop</a>
                  <span className="font-weight-bold">15</span>
                </DataTitle>
                <DataRow>
                  <Title>0x21d6bd949118bf92f87dcf0aa5911fa26f0a007f</Title>
                  <Value>5</Value>
                </DataRow>
                <DataRow>
                  <Title>0x594b7efdda12093e98945c89243b71ff79409e4a</Title>
                  <Value>2</Value>
                </DataRow>
                <DataRow>
                  <Title>0xb55794c3bef4651b6cbc78b64a2ef6c5c67837c3</Title>
                  <Value>2</Value>
                </DataRow>
                <DataRow>
                  <Title>0x23fd433bec56f7c62d7f087cd26bc8d1a6d8da78</Title>
                  <Value>2</Value>
                </DataRow>
                <DataRow>
                  <Title>0x6ab240ec96d9a32c63a37df4e529b3f9989079fc</Title>
                  <Value>1</Value>
                </DataRow>
                <DataRow>
                  <Title>0xe3fc8281bc7d1b78e67c2197b979849ed769edfa</Title>
                  <Value>1</Value>
                </DataRow>
                <DataRow>
                  <Title>0x14b68b85e1037d1c75726b7794e99c20554f9cc3</Title>
                  <Value>1</Value>
                </DataRow>
                <DataRow>
                  <Title>0xe456f33a10c423c6e0296aa14c2762595ac255e7</Title>
                  <Value>1</Value>
                </DataRow>
                <DataTitle className="d-flex flex-row justify-content-between">
                  <a href="https://ipfs.everipedia.org/ipfs/QmWZ5MSWJgms6Gb6o1xyKD4VmvCzVGq941jxBYG97bFwFq"
                     target="_blank">Snapshot</a>
                </DataTitle>
                <DataTitle className="d-flex flex-row justify-content-between">
                  <a href="https://polygonscan.com/address/0xb7185e8332fc2ff1a02664312288e11c39c0dbd0#events"
                     target="_blank">Onchain results</a>
                </DataTitle>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default memo(Raffles);
