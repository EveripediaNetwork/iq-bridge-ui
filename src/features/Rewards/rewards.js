import React, { memo, useContext, useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useWallet } from "use-wallet";
import styled from "styled-components";
import PropTypes from "prop-types";

import {
  earned,
  checkpoint,
  checkIfTheUserIsInitialized,
  getYield,
  getHiIQAt,
  claim
} from "../../utils/EthDataProvider/EthDataProvider";
import { TransactionContext } from "../../context/transactionContext";

const InfoCard = styled(Card)`
  background-color: rgba(0, 0, 0, 0.5) !important;
  width: 300px;
  margin: auto;
`;

const Rewards = ({ setLoadBalance }) => {
  const wallet = useWallet();
  const { t } = useTranslation();
  const [balance, setBalance] = useState();
  const [waitingConfirmation, setWaitingConfirmation] = useState(false);
  const { setTxDone, setHashes } = useContext(TransactionContext);

  const handleClaim = async () => {
    //const yieldResult = await getYield(wallet);
    const claimResult = await claim(wallet);
    setWaitingConfirmation(true);
    await claimResult.wait();
    console.log(claimResult);
    setHashes([claimResult.hash]);
    setTxDone(true);
    setWaitingConfirmation(false);
    // setBalance(await earned(wallet));
    setBalance(await getHiIQAt(wallet));
    setLoadBalance(true);
  };

  useEffect(() => {
    if (wallet.status === "connected" && wallet.ethereum)
      (async () => {
        const result = await checkIfTheUserIsInitialized(wallet);

        if (result === false) await checkpoint(wallet);

        if (result === true) {
          setBalance(await getHiIQAt(wallet));
          // setBalance(await earned(wallet));
        }
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
              <div className="text-white container p-0 text-justify mb-0">
                <small>
                  {t("required_to_accept")} <strong>{t("checkpoint")}</strong>{" "}
                  {t("scenarios")}:
                </small>
                <ul className="mb-0 text-left">
                  <li>
                    <small>{t("user_is_not_initialized")}</small>
                  </li>
                  <li>
                    <small>{t("more_iq_tokens_locked")}</small>
                  </li>
                  <li>
                    <small>{t("lock_time_increased")}</small>
                  </li>
                </ul>
                <small>
                  {t("This operation is used to re-calculate the rewards.")}
                </small>
              </div>
            </Card.Body>
          </InfoCard>
        </Col>
      </Row>
    </Container>
  );
};

Rewards.propTypes = {
  setLoadBalance: PropTypes.func.isRequired
};

export default memo(Rewards);
