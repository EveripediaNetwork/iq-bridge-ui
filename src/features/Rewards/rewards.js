import React, { memo, useContext, useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useWallet } from "use-wallet";
import styled from "styled-components";

import {
  earned,
  checkpoint,
  checkIfTheUserIsInitialized,
  getYield
} from "../../utils/EthDataProvider/EthDataProvider";
import { TransactionContext } from "../../context/transactionContext";

const InfoCard = styled(Card)`
  background-color: rgba(0, 0, 0, 0.5) !important;
`;

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
    await checkpoint(wallet);
  };

  useEffect(() => {
    if (wallet.status === "connected" && wallet.ethereum)
      (async () => {
        const result = await checkIfTheUserIsInitialized(wallet);

        if (result === false) await checkpoint(wallet);

        if (result === true) setBalance(await earned(wallet));
      })();
  }, [wallet.status]);

  return (
    <Container style={{ width: 360 }} className="pt-5 mt-5">
      <Row>
        <Col className="pt-2">
          <Card className="mx-auto shadow-sm">
            <Card.Body>
              {balance ? (
                <h4 className="text-center">
                  <span className="font-weight-normal">
                    {Number(balance).toFixed(6)}
                  </span>{" "}
                  IQ{" "}
                  <span className="font-weight-normal text-lowercase">
                    {t("earned")}
                  </span>
                </h4>
              ) : null}
              {!wallet.account && (
                <h5 className="font-weight-normal text-center">
                  {t("earn_iqs")}
                </h5>
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
                disabled={
                  !balance || Number(balance) === 0 || waitingConfirmation
                }
                variant="primary"
                className="text-capitalize"
                size="lg"
                block
              >
                {t("claim")}
              </Button>
            </Card.Body>
          </Card>
          <br />
          <InfoCard className="shadow">
            <Card.Body>
              <p className="text-white text-left mb-0">
                We will require you to accept <strong>checkpoint</strong>{" "}
                contract interaction in the following scenarios:
                <ul>
                  <li>The user is not initialized in our system.</li>
                  <li>More IQ tokens are locked.</li>
                  <li>Lock time is increased.</li>
                </ul>
              </p>
            </Card.Body>
          </InfoCard>
        </Col>
      </Row>
    </Container>
  );
};

export default memo(Rewards);
