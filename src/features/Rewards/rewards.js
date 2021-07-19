import React, { memo, useContext, useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useWallet } from "use-wallet";

import { earned, getYield } from "../../utils/EthDataProvider/EthDataProvider";
import { TransactionContext } from "../../context/transactionContext";
import InfoAlert from "../../components/ui/infoAlert";
import Layout from "../../components/layouts/layout";
import CardTitle from "../../components/ui/cardTitle";

const Rewards = () => {
  const wallet = useWallet();
  const { t } = useTranslation();
  const [balance, setBalance] = useState();
  const [waitingConfirmation, setWaitingConfirmation] = useState(false);
  const { setTxDone, setHashes } = useContext(TransactionContext);

  const handleClaim = async () => {
    const yieldResult = await getYield(wallet);
    setWaitingConfirmation(true);
    await yieldResult.wait();
    setHashes([yieldResult.hash]);
    setTxDone(true);
    setWaitingConfirmation(false);
    setBalance(await earned(wallet));
  };

  useEffect(() => {
    if (wallet.status === "connected" && wallet.ethereum)
      (async () => setBalance(await earned(wallet)))();
  }, [wallet.status]);

  return (
    <Layout>
      <Container className="p-2 mt-3">
        <Row>
          <Col>
            <CardTitle title="IQ Bridge" aria-label="lock" icon="🤑" />
            <Card className="mx-auto shadow-sm">
              <Card.Body>
                {balance && (
                  <h3 className="text-center">
                    {t("earned")}: {Number(balance).toFixed(4)} IQ
                  </h3>
                )}
                {waitingConfirmation && (
                  <div className="text-center container d-flex flex-row justify-content-center">
                    <h6 className="text-center text-muted">
                      {t("waiting_network_confirmation")}
                    </h6>
                  </div>
                )}
                <Button
                  onClick={handleClaim}
                  disabled={!balance || balance === 0 || waitingConfirmation}
                  variant="primary"
                  className="text-capitalize"
                  size="lg"
                  block
                >
                  {t("claim")}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {!wallet.account && (
          <Row>
            <Col>
              <InfoAlert text={t("please_login")} />
            </Col>
          </Row>
        )}
      </Container>
    </Layout>
  );
};

export default memo(Rewards);
