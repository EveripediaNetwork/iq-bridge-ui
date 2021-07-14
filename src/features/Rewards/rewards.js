import React, { memo, useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { useWallet } from "use-wallet";

import { earned } from "../../utils/EthDataProvider/EthDataProvider";
import Layout from "../../components/layouts/layout";
import CardTitle from "../../components/ui/cardTitle";

const Rewards = () => {
  const wallet = useWallet();
  const methods = useForm({ mode: "onChange" });
  const [balance, setBalance] = useState();

  useEffect(() => {
    if (wallet.status === "connected" && wallet.ethereum)
      (async () => {
        setBalance(await earned(wallet));
      })();
  }, [wallet.status]);

  return (
    <Layout>
      <Container className="p-2 mt-3">
        <FormProvider {...methods}>
          <Row>
            <Col>
              <CardTitle title="IQ Bridge" aria-label="lock" icon="🤑" />
              <Card className="mx-auto shadow-sm">
                <Card.Body>
                  {balance && (
                    <h3 className="text-center">Earned: {balance}</h3>
                  )}
                  <div className="text-center">
                    <Button variant="primary" size="lg">
                      Claim
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </FormProvider>
      </Container>
    </Layout>
  );
};

export default memo(Rewards);
