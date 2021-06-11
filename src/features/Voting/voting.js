import React, { memo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Card, Col, Container, Row, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useWallet } from "use-wallet";

import ProposalsModal from "../../components/ui/proposalsModal";
import Layout from "../../components/layouts/layout";
import CardTitle from "../../components/ui/cardTitle";
import InfoAlert from "../../components/ui/infoAlert";
import VotingProposalContent from "./votingProposalContent";
import VotingProposalForm from "./votingProposalForm";
import { ProposalContext } from "../../context/proposalContext";

const Voting = () => {
  const { t } = useTranslation();
  const methods = useForm({ mode: "onChange" });
  const wallet = useWallet();
  const [txDone, setTxDone] = useState(false);
  const [proposals, setProposals] = useState();
  const [selectedProposal, setSelectedProposal] = useState();
  const [openProposalsModal, setOpenProposalsModal] = useState(false);

  const handleSelectProposalClick = () => {
    setOpenProposalsModal(true);
  };

  const proposalContextValue = {
    proposals,
    setProposals,
    selectedProposal,
    setSelectedProposal
  };

  return (
    <Layout>
      <Container className="p-2 mt-3" fluid>
        <FormProvider {...methods}>
          <ProposalContext.Provider value={proposalContextValue}>
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
                      <div className="d-flex flex-column justify-content center">
                        {!selectedProposal ? (
                          <div className="text-center">
                            <Button
                              variant="light"
                              style={{ maxWidth: "100%" }}
                              onClick={handleSelectProposalClick}
                            >
                              {t("select_a_proposal")}
                            </Button>
                          </div>
                        ) : (
                          <div style={{ maxWidth: "100%" }}>
                            <Button variant="outline-dark">
                              {selectedProposal.title.length > 25
                                ? `${
                                    selectedProposal.title.match(/.{1,25}/g)[0]
                                  }...`
                                : selectedProposal.title}
                            </Button>
                          </div>
                        )}

                        <ProposalsModal
                          setShow={setOpenProposalsModal}
                          onHide={() => setOpenProposalsModal(false)}
                          show={openProposalsModal}
                        />
                      </div>
                    </div>
                    <VotingProposalContent proposal={selectedProposal} />
                    <br />
                    <VotingProposalForm
                      proposal={setSelectedProposal}
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
          </ProposalContext.Provider>
        </FormProvider>
      </Container>
    </Layout>
  );
};

export default memo(Voting);
