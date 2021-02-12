import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Layout from "../components/layouts/layout";

const Error = () => {
  return (
    <Layout update={false}>
      <Container className="p-3 mt-5" fluid>
        <Row>
          <Col>Error!...</Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default React.memo(Error);
