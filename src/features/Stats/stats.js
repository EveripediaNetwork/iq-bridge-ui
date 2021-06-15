import React, { memo, useEffect, useState } from "react";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import * as Humanize from "humanize-plus";

import styled from "styled-components";
import Layout from "../../components/layouts/layout";
import CardTitle from "../../components/ui/cardTitle";
import {
  getEpData,
  getSocialData,
  getTokenHolders,
  getTotals,
  getHiIQ,
  getLPs,
  getVolume
} from "../../utils/StatsDataProvider";

const DataTitle = styled.div`
  font-size: 20px;
  border-bottom: 1px solid #ecebeb;
  margin: 20px 5px 5px 5px;
`;

const DataRow = styled.div`
  content: "";
  display: table;
  clear: both;
  width: 100%;
  margin-bottom: 4px;
`;

const Icon = styled.div`
  img {
    width: 23px;
  }

  float: left;
  width: 8%;
}
`;

const Title = styled.div`
  padding-left: 2px;
  float: left;
  width: 62%;
}
`;

const Value = styled.div`
  float: right;
  width: 30%;
  text-align: right;
}
`;

const showData = value => {
  return value !== undefined ? (
    Humanize.intComma(value)
  ) : (
    <Spinner animation="border" variant="primary" role="status" size="sm">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
};

const Stats = () => {
  // const { t } = useTranslation();
  // TODO: add translations
  const [data, setData] = useState({});
  useEffect(() => {
    async function run() {
      const holders = await getTokenHolders();
      setData(prevState => {
        return { ...prevState, ...holders };
      });
      const volume = await getVolume();
      setData(prevState => {
        return { ...prevState, ...volume };
      });
      const totals = await getTotals();
      setData(prevState => {
        return { ...prevState, ...totals };
      });
      const hiiq = await getHiIQ();
      setData(prevState => {
        return { ...prevState, ...hiiq };
      });
      const lp = await getLPs();
      setData(prevState => {
        return { ...prevState, ...lp };
      });
      const social = await getSocialData();
      setData(prevState => {
        return { ...prevState, ...social };
      });
      const ep = await getEpData();
      setData(prevState => {
        return { ...prevState, ...ep };
      });
    }

    run();
  }, []);
  return (
    <Layout>
      <Container className="p-2 mt-3" fluid>
        <Row>
          <Col>
            <CardTitle
              title="IQ Stats"
              role="img"
              aria-label="lock"
              className="brain"
              icon="📊"
            />
            <Card className="mx-auto shadow-sm">
              <Card.Body>
                <DataTitle>Holders</DataTitle>
                <DataRow>
                  <Icon>
                    <img alt="EOS" src="/tokens/1765.png" />
                  </Icon>
                  <Title>EOS Holders</Title>
                  <Value>{showData(data.holders?.eos)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="ethereum" src="/tokens/1027.png" />
                  </Icon>
                  <Title>Ethereum Holders</Title>
                  <Value>{showData(data.holders?.eth)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="polygon" src="/tokens/3890.png" />
                  </Icon>
                  <Title>Polygon Holders</Title>
                  <Value>{showData(data.holders?.matic)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="BSC" src="/tokens/1839.png" />
                  </Icon>
                  <Title>BSC Holders</Title>
                  <Value>{showData(data.holders?.bsc)}</Value>
                </DataRow>

                <DataTitle>Volume</DataTitle>
                <DataRow>
                  <Icon>
                    <img alt="EOS" src="/tokens/1765.png" />
                  </Icon>
                  <Title>EOS Volume</Title>
                  <Value>{showData(data.volume?.eos)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="ethereum" src="/tokens/1027.png" />
                  </Icon>
                  <Title>Ethereum Volume</Title>
                  <Value>{showData(data.volume?.eth)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="polygon" src="/tokens/3890.png" />
                  </Icon>
                  <Title>Polygon Volume</Title>
                  <Value>{showData(data.volume?.matic)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="BSC" src="/tokens/1839.png" />
                  </Icon>
                  <Title>BSC Volume</Title>
                  <Value>{showData(data.volume?.bsc)}</Value>
                </DataRow>

                <DataTitle>Total</DataTitle>
                <DataRow>
                  <Icon>
                    <img alt="IQ" src="/tokens/2930.png" />
                  </Icon>
                  <Title>Total Volume</Title>
                  <Value>
                    {showData(
                      parseInt(data.volume?.eos || 0, 10) +
                        parseInt(data.volume?.eth || 0, 10) +
                        parseInt(data.volume?.matic || 0, 10) +
                        parseInt(data.volume?.bsc || 0, 10)
                    )}
                  </Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="IQ" src="/tokens/2930.png" />
                  </Icon>
                  <Title>Total Holders</Title>
                  <Value>
                    {showData(
                      parseInt(data.holders?.eos || 0, 10) +
                        parseInt(data.holders?.eth || 0, 10, 10) +
                        parseInt(data.holders?.matic || 0, 10) +
                        parseInt(data.holders?.bsc || 0, 10)
                    )}
                  </Value>
                </DataRow>

                <DataTitle>HiIQ</DataTitle>
                <DataRow>
                  <Icon>
                    <img alt="IQ" src="/tokens/2930.png" />
                  </Icon>
                  <Title>HiIQ tokens</Title>
                  <Value>{showData(data.hiiq?.holders)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="IQ" src="/tokens/2930.png" />
                  </Icon>
                  <Title>HiIQ holders</Title>
                  <Value>{showData(data.hiiq?.volume)}</Value>
                </DataRow>

                <DataTitle>Apps</DataTitle>
                <DataRow>
                  <Icon>
                    <img alt="IQ" src="/tokens/2930.png" />
                  </Icon>
                  <Title>PredIQt markets</Title>
                  <Value>{showData(data.prediqt?.markets)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="IQ" src="/tokens/2930.png" />
                  </Icon>
                  <Title>Everipedia articles</Title>
                  <Value>{showData(data.ep?.articles)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="IQ" src="/tokens/2930.png" />
                  </Icon>
                  <Title>Everipedia Onchain Edits</Title>
                  <Value>{showData(data.ep?.edits)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="IQ" src="/tokens/2930.png" />
                  </Icon>
                  <Title>Everipedia page views</Title>
                  <Value>{showData(data.ep?.views)}</Value>
                </DataRow>

                <DataTitle>Liquidity</DataTitle>
                <DataRow>
                  <Icon>
                    <img alt="uni" src="/tokens/7083.png" />
                  </Icon>
                  <Title>LP liquidity Uniswap v2</Title>
                  <Value>${showData(data.lp?.uniswap)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="Quickswap" src="/tokens/8206.png" />
                  </Icon>
                  <Title>LP liquidity QuickSwap</Title>
                  <Value>${showData(data.lp?.quickswap)}</Value>
                </DataRow>

                <DataTitle>Social</DataTitle>
                <DataRow>
                  <Icon>
                    <img alt="IQ" src="/tokens/2930.png" />
                  </Icon>
                  <Title>Reddit users</Title>
                  <Value>{showData(data.social?.reddit)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="IQ" src="/tokens/2930.png" />
                  </Icon>
                  <Title>Twitter followers</Title>
                  <Value>{showData(data.social?.twitter)}</Value>
                </DataRow>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default memo(Stats);
