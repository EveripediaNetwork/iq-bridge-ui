import React, { memo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useWallet } from "use-wallet";
import Layout from "../../components/layouts/layout";
import CardTitle from "../../components/ui/cardTitle";
import InfoAlert from "../../components/ui/infoAlert";
import VotingSelector from "./votingSelector";
import VotingProposalContent from "./votingProposalContent";
import VotingProposalForm from "./votingProposalForm";

const Voting = () => {
  const { t } = useTranslation();
  const methods = useForm({ mode: "onChange" });
  const wallet = useWallet();
  const [txDone, setTxDone] = useState(false);
  const [proposal, setProposal] = useState(null);

  return (
    <Layout>
      <Container className="p-2 mt-3" fluid>
        <FormProvider {...methods}>
          <Row>
            <Col>
              <CardTitle
                title={t("voting")}
                aria-label={t("voting")}
                icon="⚖"
              />
              <Card className="mx-auto shadow-sm">
                <Card.Body>
                  <div className="d-flex flex-row justify-content-center">
                    <VotingSelector onSelect={setProposal} />
                  </div>
                  <VotingProposalContent proposal={proposal} />
                  <VotingProposalForm
                    proposal={proposal}
                    onTxDone={setTxDone}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {wallet.account && txDone && (
            <Row>
              <Col>
                <InfoAlert text={t("confirmed_tx")} />
              </Col>
            </Row>
          )}
          {!wallet.account && (
            <Row>
              <Col>
                <InfoAlert text={t("login_info_eth")} />
              </Col>
            </Row>
          )}
        </FormProvider>
      </Container>
    </Layout>
  );
};

export default memo(Voting);
