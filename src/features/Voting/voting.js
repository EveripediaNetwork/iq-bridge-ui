import React, { memo, useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Card, Col, Container, Row, Button, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useWallet } from "use-wallet";
import styled from "styled-components";

import { ProposalContext } from "../../context/proposalContext";
import {
  vote,
  getProposals,
  getVoteByVoter,
  getVotes
} from "../../utils/SnapshotProvider";
import ProposalsModal from "../../components/ui/proposalsModal";
import Layout from "../../components/layouts/layout";
import CardTitle from "../../components/ui/cardTitle";
import InfoAlert from "../../components/ui/infoAlert";
import VotingChart from "./votingChart";
import VotingProposalForm from "./votingProposalForm";
import VoteBreakdown from "../../components/ui/voteBreakdown";
import GenericDialog from "../../components/ui/genericDialog";
import ProposalDetails from "../../components/ui/proposalDetails";

const StyledCard = styled(Card)`
  min-height: 583px;
`;

const SpinnerDiv = styled.div`
  height: 583px;
`;

const SelectedProposalButton = styled(Button)`
  border-radius: 5px !important;
`;

const Voting = () => {
  const { t } = useTranslation();
  const methods = useForm({ mode: "onChange" });
  const wallet = useWallet();
  const [txDone, setTxDone] = useState(false);
  const [proposals, setProposals] = useState();
  const [selectedProposal, setSelectedProposal] = useState();
  const [loadingSelectedProposal, setLoadingSelectedProposal] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState();
  const [votes, setVotes] = useState();
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [loadVotes, setLoadVotes] = useState(true);
  const [openProposalsModal, setOpenProposalsModal] = useState(false);
  const [openSelectedProposal, setOpenSelectedProposal] = useState(false);

  const handleSelectProposalClick = () => {
    setOpenProposalsModal(true);
  };

  const handleVote = async () => {
    const flag = await vote(wallet, selectedProposal.id, selectedChoice);
    if (flag === 1) {
      setTxDone(true);
      setLoadVotes(true);
    }
  };

  const handleSetSelecthedChoice = value => {
    setSelectedChoice(selectedProposal.choices.indexOf(value) + 1);
  };

  const proposalContextValue = {
    proposals,
    setProposals,
    selectedProposal,
    setSelectedProposal
  };

  useEffect(() => {
    (async () => {
      setLoadingSelectedProposal(true);
      const data = await getProposals(1);
      setSelectedProposal(data[0]);
      setLoadingSelectedProposal(false);
    })();
  }, []);

  useEffect(() => {
    if (selectedProposal && selectedProposal.id && loadVotes === true) {
      (async () => {
        const data = await getVotes(selectedProposal.id, 1000);
        setVotes(data);
        setLoadVotes(false);
      })();
    }
  }, [selectedProposal, loadVotes]);

  useEffect(() => {
    (async () => {
      if (wallet.status === "connected") {
        const result = await getVoteByVoter(wallet.account);
        if (result) setSelectedChoice(result.choice);
        setAlreadyVoted(true);
      }
    })();
  }, [wallet.status]);

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
                <StyledCard className="mx-auto shadow-sm">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div className="d-flex flex-row justify-content-center">
                      <div className="d-flex flex-column justify-content center">
                        {!selectedProposal ? (
                          <>
                            {!loadingSelectedProposal && (
                              <div className="text-center">
                                <Button
                                  variant="light"
                                  style={{ maxWidth: "100%" }}
                                  onClick={handleSelectProposalClick}
                                >
                                  {t("select_a_proposal")}
                                </Button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div style={{ maxWidth: "100%" }}>
                            <SelectedProposalButton
                              onClick={() => setOpenSelectedProposal(true)}
                              className="shadow"
                              variant="success"
                            >
                              {selectedProposal.title.length > 35
                                ? `${
                                    selectedProposal.title.match(/.{1,35}/g)[0]
                                  }...`
                                : selectedProposal.title}
                            </SelectedProposalButton>
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
                    {selectedProposal && votes ? (
                      <VotingChart
                        votes={votes}
                        choices={selectedProposal.choices}
                      />
                    ) : (
                      <>
                        {!loadingSelectedProposal && (
                          <SpinnerDiv className="d-flex flex-column align-items-center justify-content-center text-center">
                            {!selectedProposal ? (
                              <>
                                <h2 className="font-weight-light">
                                  Select a proposal to see details
                                </h2>
                                <br />
                                <h2>😃</h2>
                              </>
                            ) : (
                              <Spinner animation="grow" />
                            )}
                          </SpinnerDiv>
                        )}
                      </>
                    )}
                    {votes && (
                      <VoteBreakdown
                        choices={selectedProposal.choices}
                        votes={votes}
                      />
                    )}
                    {selectedProposal && wallet.account !== null && (
                      <VotingProposalForm
                        choices={selectedProposal.choices}
                        selectedChoice={selectedChoice}
                        setSelectedChoice={handleSetSelecthedChoice}
                      />
                    )}
                    {selectedProposal && (
                      <Button
                        disabled={
                          !selectedProposal || !alreadyVoted || !wallet.account
                        }
                        onClick={handleVote}
                        variant="primary"
                        className="text-capitalize"
                        type="submit"
                        size="lg"
                        block
                      >
                        Vote
                      </Button>
                    )}
                  </Card.Body>
                </StyledCard>
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
