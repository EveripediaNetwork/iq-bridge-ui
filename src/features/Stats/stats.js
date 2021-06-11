import React, { memo } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

import Layout from "../../components/layouts/layout";
import CardTitle from "../../components/ui/cardTitle";

const Stats = () => {
  // const { t } = useTranslation();
  // TODO: add translations / improve UI (add icons) / think about strategy to retrieve data
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
                <table>
                  <tr>
                    <td>EOS Holders</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>Ethereum Holders</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>Polygon Holders</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>BSC Holders</td>
                    <td>3</td>
                  </tr>
                </table>
                <hr />

                <table>
                  <tr>
                    <td>EOS Volume</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>Ethereum Volume</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>Polygon Volume</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>BSC Volume</td>
                    <td>3</td>
                  </tr>
                </table>
                <hr />

                <table>
                  <tr>
                    <td>Total Volume</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>Total Holders</td>
                    <td>3</td>
                  </tr>
                </table>
                <hr />

                <table>
                  <tr>
                    <td>HiIQ tokens</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>HiIQ holders</td>
                    <td>3</td>
                  </tr>
                </table>
                <hr />

                <table>
                  <tr>
                    <td>LP liquidity Uniswap v3</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>LP liquidity QuickSwap</td>
                    <td>3</td>
                  </tr>
                </table>
                <hr />

                <table>
                  <tr>
                    <td>PredIQt markets</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>Everipedia articles</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>Everipedia Editors</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>Everipedia page views</td>
                    <td>3</td>
                  </tr>
                </table>
                <hr />

                <table>
                  <tr>
                    <td>Reddit users</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>Tg users</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>Twitter users</td>
                    <td>3</td>
                  </tr>
                </table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default memo(Stats);
