import React, { memo, useEffect, useState } from "react";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import * as Humanize from "humanize-plus";

import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Layout from "../../components/layouts/layout";
import CardTitle from "../../components/ui/cardTitle";
import {
  getEpData,
  getSocialData,
  getTokenHolders,
  getHiIQ,
  getLPs,
  getVolume
} from "../../utils/StatsDataProvider";

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
  const { t } = useTranslation();
  // TODO: add translations
  const [data, setData] = useState({});
  const [totals, setTotals] = useState({});

  const getMappedValue = object => {
    let val = 0;
    // eslint-disable-next-line array-callback-return
    Object.values(object).map(h => {
      val += Number(h);
    });

    return val;
  };

  useEffect(() => {
    async function run() {
      const holders = await getTokenHolders();
      setData(prevState => {
        return { ...prevState, ...holders };
      });

      setTotals(prev => ({
        ...prev,
        holders: getMappedValue(holders.holders)
      }));

      const volume = await getVolume();
      setData(prevState => {
        return { ...prevState, ...volume };
      });

      setTotals(prev => ({
        ...prev,
        volume: getMappedValue(volume.volume)
      }));

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
                <DataTitle className="d-flex flex-row justify-content-between">
                  {t("holders")}

                  <span className="font-weight-bold">
                    {totals.holders > 0 ? (
                      <>{showData(totals.holders)}</>
                    ) : null}
                  </span>
                </DataTitle>

                <DataRow>
                  <Icon>
                    <img alt="EOS" src="/tokens/1765.png" />
                  </Icon>
                  <Title>EOS {t("holders")}</Title>
                  <Value>{showData(data.holders?.eos)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="ethereum" src="/tokens/1027.png" />
                  </Icon>
                  <Title>Ethereum {t("holders")}</Title>
                  <Value>{showData(data.holders?.eth)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="polygon" src="/tokens/3890.png" />
                  </Icon>
                  <Title>Polygon {t("holders")}</Title>
                  <Value>{showData(data.holders?.matic)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="BSC" src="/tokens/1839.png" />
                  </Icon>
                  <Title>BSC {t("holders")}</Title>
                  <Value>{showData(data.holders?.bsc)}</Value>
                </DataRow>

                <DataTitle className="d-flex flex-row justify-content-between">
                  {t("volume")}
                  <span className="font-weight-bold">
                    {totals && totals.volume > 0 ? (
                      <>{showData(totals.volume)}</>
                    ) : null}
                  </span>
                </DataTitle>
                <DataRow>
                  <Icon>
                    <img alt="EOS" src="/tokens/1765.png" />
                  </Icon>
                  <Title>EOS {t("volume")}</Title>
                  <Value>{showData(data.volume?.eos)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="ethereum" src="/tokens/1027.png" />
                  </Icon>
                  <Title>Ethereum {t("volume")}</Title>
                  <Value>{showData(data.volume?.eth)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="polygon" src="/tokens/3890.png" />
                  </Icon>
                  <Title>Polygon {t("volume")}</Title>
                  <Value>{showData(data.volume?.matic)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="BSC" src="/tokens/1839.png" />
                  </Icon>
                  <Title>BSC {t("volume")}</Title>
                  <Value>{showData(data.volume?.bsc)}</Value>
                </DataRow>
                <DataTitle>HiIQ</DataTitle>
                <DataRow>
                  <Icon>
                    <img alt="IQ" src="/tokens/iq.png" />
                  </Icon>
                  <Title>HiIQ {t("volume")}</Title>
                  <Value>{showData(data.hiiq?.volume)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="IQ" src="/tokens/iq.png" />
                  </Icon>
                  <Title>HiIQ {t("holders")}</Title>
                  <Value>{showData(data.hiiq?.holders)}</Value>
                </DataRow>

                <DataTitle>{t("apps")}</DataTitle>
                <DataRow>
                  <Icon>
                    <img alt="IQ" src="/tokens/2930.png" />
                  </Icon>
                  <Title>{t("prediqt_markets")}</Title>
                  <Value>{showData(data.prediqt?.markets)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="IQ" src="/tokens/2930.png" />
                  </Icon>
                  <Title>{t("everipedia_articles")}</Title>
                  <Value>{showData(data.ep?.articles)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="IQ" src="/tokens/2930.png" />
                  </Icon>
                  <Title>{t("everipedia_onchain_edits")}</Title>
                  <Value>{showData(data.ep?.edits)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="IQ" src="/tokens/2930.png" />
                  </Icon>
                  <Title>{t("everipedia_page_views")}</Title>
                  <Value>{showData(data.ep?.views)}</Value>
                </DataRow>

                <DataTitle>{t("liquidity")}</DataTitle>
                <DataRow>
                  <Icon>
                    <img alt="uni" src="/tokens/7083.png" />
                  </Icon>
                  <Title>LP {t("liquidity")} Uniswap v2</Title>
                  <Value>${showData(data.lp?.uniswap)}</Value>
                </DataRow>
                <DataRow>
                  <Icon>
                    <img alt="Quickswap" src="/tokens/8206.png" />
                  </Icon>
                  <Title>LP {t("liquidity")} QuickSwap</Title>
                  <Value>${showData(data.lp?.quickswap)}</Value>
                </DataRow>

                <DataTitle>{t("social")}</DataTitle>
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
