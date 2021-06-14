import React, { memo, useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Card, Col, Container, Row, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useWallet } from "use-wallet";

import { ProposalContext } from "../../context/proposalContext";
import { getProposals, getVotes } from "../../utils/SnapshotProvider";
import ProposalsModal from "../../components/ui/proposalsModal";
import Layout from "../../components/layouts/layout";
import CardTitle from "../../components/ui/cardTitle";
import InfoAlert from "../../components/ui/infoAlert";
import VotingChart from "./votingChart";
import VotingProposalForm from "./votingProposalForm";
import GenericDialog from "../../components/ui/genericDialog";
import ProposalDetails from "../../components/ui/proposalDetails";

const Voting = () => {
  const { t } = useTranslation();
  const methods = useForm({ mode: "onChange" });
  const wallet = useWallet();
  const [txDone, setTxDone] = useState(false);
  const [proposals, setProposals] = useState();
  const [selectedProposal, setSelectedProposal] = useState();
  const [selectedChoice, setSelectedChoice] = useState();
  const [votes, setVotes] = useState();
  const [openProposalsModal, setOpenProposalsModal] = useState(false);
  const [openSelectedProposal, setOpenSelectedProposal] = useState(false);

  const handleSelectProposalClick = () => {
    setOpenProposalsModal(true);
  };

  const handleVote = () => {};

  const proposalContextValue = {
    proposals,
    setProposals,
    selectedProposal,
    setSelectedProposal
  };

  useEffect(() => {
    (async () => {
      const data = await getProposals(1);
      setSelectedProposal(data[0]);
    })();
  }, []);

  useEffect(() => {
    if (selectedProposal && selectedProposal.id)
      (async () => {
        const data = await getVotes(selectedProposal.id, 1000);
        setVotes(data);
        console.log(data);
      })();
  }, [selectedProposal]);

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
                            <Button
                              onClick={() => setOpenSelectedProposal(true)}
                              variant="outline-success"
                            >
                              {selectedProposal.title.length > 25
                                ? `${
                                    selectedProposal.title.match(/.{1,25}/g)[0]
                                  }...`
                                : selectedProposal.title}
                            </Button>
                            <GenericDialog
                              show={openSelectedProposal}
                              onHide={() => setOpenSelectedProposal(false)}
                              size="md"
                              title="Details"
                              body={
                                // eslint-disable-next-line react/jsx-wrap-multilines
                                <ProposalDetails
                                  setShow={() => setOpenSelectedProposal(false)}
                                  proposal={selectedProposal}
                                />
                              }
                            />
                          </div>
                        )}

                        <ProposalsModal
                          setShow={setOpenProposalsModal}
                          onHide={() => setOpenProposalsModal(false)}
                          show={openProposalsModal}
                        />
                      </div>
                    </div>
                    {selectedProposal && votes && (
                      <VotingChart
                        votes={votes}
                        choices={selectedProposal.choices}
                      />
                    )}
                    {selectedProposal && (
                      <>
                        <hr />
                        <VotingProposalForm
                          setSelectedChoice={setSelectedChoice}
                          choices={selectedProposal.choices}
                        />
                        <hr />
                      </>
                    )}
                    <Button
                      disabled={!selectedProposal || !selectedChoice}
                      onClick={handleVote}
                      variant="primary"
                      className="text-capitalize"
                      type="submit"
                      size="lg"
                      block
                    >
                      Vote
                    </Button>
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
