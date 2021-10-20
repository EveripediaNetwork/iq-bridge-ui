import React, { memo } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Layout from "../components/layouts/layout";
import CardTitle from "../components/ui/cardTitle";
import useTitle from "../hooks/useTitle";

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
  const { t } = useTranslation();
  useTitle("Home");

  return (
    <Layout>
      <Container className="mt-3" fluid>
        <Row>
          <Col>
            <CardTitle title="IQ" aria-label="brain" icon="🧠" />
            <Card className="mx-auto shadow-sm">
              <Card.Body>
                <p>
                  {t("iq_description")}{" "}
                  <a
                    href="https://learn.everipedia.org/"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {t("docs")}
                  </a>{" "}
                  {t("for_technical_specs")}
                  <br />
                  <br />
                  <Link to="/bridge">{t("bridge")}</Link> {t("bridge_desc")}
                  <br />
                  <br />
                  {t("iq_defi_token")}{" "}
                  <Link to="/lock">{t("staked_for_hiiq")}</Link> {t("to_earn")}
                  <br />
                  <br />
                  {t("check_the")}{" "}
                  <Link to="/stats">{String(t("stats")).toLowerCase()}</Link>{" "}
                  {t("stats_desc")}
                  <br />
                  <br />
                  {t("other_feats")}
                  <Link to="/voting">{String(t("voting")).toLowerCase()}</Link>
                  {t("new_feats_soon")}
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
