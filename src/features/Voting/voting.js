import React, { memo, useState, useEffect, useContext } from "react";
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
import { TransactionContext } from "../../context/transactionContext";
import useTitle from "../../hooks/useTitle";

const StyledCard = styled(Card)`
  min-height: 583px;
`;

const SpinnerDiv = styled.div`
  height: 553px;
`;

const SelectedProposalButton = styled(Button)`
  border-radius: 5px !important;
`;

const Voting = () => {
  const { t } = useTranslation();
  useTitle("Voting");
  const methods = useForm({ mode: "onChange" });
  const wallet = useWallet();
  const { setTxDone } = useContext(TransactionContext);
  const [proposals, setProposals] = useState();
  const [selectedProposal, setSelectedProposal] = useState();
  const [loadingSelectedProposal, setLoadingSelectedProposal] = useState(false);
  const [loadingVotes, setLoadingVotes] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState();
  const [votes, setVotes] = useState();
  const [loadVotes, setLoadVotes] = useState();
  const [onVotingTimeWindow, setOnVotingTimeWindow] = useState();
  const [openProposalsModal, setOpenProposalsModal] = useState(false);
  const [openSelectedProposal, setOpenSelectedProposal] = useState(false);

  const handleSelectProposalClick = () => {
    setOpenProposalsModal(true);
  };

  const handleVote = async () => {
    setLoadingVotes(true);
    const flag = await vote(wallet, selectedProposal.id, selectedChoice);
    if (flag === 1) {
      setTxDone(true);
      setLoadVotes(true);
      setLoadingVotes(false);
    }
  };

  const handleSetSelecthedChoice = value => {
    const idxOf = selectedProposal.choices.indexOf(value) + 1;
    if (selectedProposal.type === "single-choice") setSelectedChoice(idxOf);

    if (selectedProposal.type === "approval") {
      if (selectedChoice)
        if (selectedChoice.includes(idxOf))
          setSelectedChoice(selectedChoice.filter(c => c !== idxOf));
        else setSelectedChoice(prev => [...prev, idxOf]);
      else setSelectedChoice([idxOf]);
    }
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
      setLoadVotes(true);
      const data = await getProposals(1);
      setSelectedProposal(data[0]);
      setLoadingSelectedProposal(false);
    })();
  }, []);

  useEffect(() => {
    if (selectedProposal && selectedProposal.id && loadVotes) {
      (async () => {
        setOnVotingTimeWindow(
          new Date() <= new Date(selectedProposal.end * 1000)
        );
        setLoadingVotes(true);
        setVotes(undefined);
        const data = await getVotes(selectedProposal.id, 1000);
        setVotes(data);
        setLoadVotes(false);
        setLoadingVotes(false);
      })();
    }

    if (!selectedProposal) {
      setVotes(undefined);
      setSelectedChoice(undefined);
    }
  }, [selectedProposal, loadVotes]);

  useEffect(() => {
    (async () => {
      if (wallet.status === "connected" && selectedProposal) {
        const result = await getVoteByVoter(
          wallet.account,
          selectedProposal.id
        );
        if (result) {
          setSelectedChoice(result.choice);
        }
      }
    })();
  }, [selectedProposal, wallet.status]);

  return (
    <Layout>
      <Container className="mt-3" fluid>
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
                              title={t("details")}
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
                    {selectedProposal && votes && votes.length > 0 ? (
                      <VotingChart
                        votes={votes}
                        choices={selectedProposal.choices}
                        loadingVotes={loadingVotes}
                      />
                    ) : (
                      <SpinnerDiv className="d-flex flex-column text-center align-items-center justify-content-center text-center">
                        {!loadingSelectedProposal && (
                          <>
                            {!selectedProposal && (
                              <>
                                <h2 className="font-weight-light">
                                  {t("select_proposal_to_see_details")}
                                </h2>
                                <br />
                                <h2>😃</h2>
                              </>
                            )}
                          </>
                        )}

                        {!loadingSelectedProposal &&
                          selectedProposal &&
                          votes &&
                          votes.length === 0 && (
                            <>
                              <h2 className="font-weight-light">
                                {t("no_votes_so_far")}
                              </h2>
                              <br />
                              <h2>😕</h2>
                            </>
                          )}

                        {loadingSelectedProposal && (
                          <Spinner animation="grow" />
                        )}
                      </SpinnerDiv>
                    )}
                    {selectedProposal && votes && votes.length > 0 && (
                      <VoteBreakdown
                        choices={selectedProposal.choices}
                        votes={votes}
                        type={selectedProposal.type}
                      />
                    )}
                    {selectedProposal && wallet.account !== null && votes && (
                      <VotingProposalForm
                        choices={selectedProposal.choices}
                        selectedChoice={selectedChoice}
                        votingType={selectedProposal.type}
                        setSelectedChoice={handleSetSelecthedChoice}
                        onVotingTimeWindow={onVotingTimeWindow}
                      />
                    )}
                    {selectedProposal && (
                      <Button
                        disabled={
                          !selectedProposal ||
                          !wallet.account ||
                          !onVotingTimeWindow ||
                          !selectedChoice
                        }
                        onClick={handleVote}
                        variant={onVotingTimeWindow ? "primary" : "danger"}
                        className="text-capitalize"
                        type="submit"
                        size="lg"
                        block
                      >
                        {onVotingTimeWindow ? t("vote") : t("voting_ended")}
                      </Button>
                    )}
                  </Card.Body>
                </StyledCard>
              </Col>
            </Row>
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
