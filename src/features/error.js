import React, { memo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import Layout from "../components/layouts/layout";

const Error = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <Container className="p-3 mt-5" fluid>
        <Row>
          <Col>{t("error")}!...</Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default memo(Error);
