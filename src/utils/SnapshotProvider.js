import axios from "axios";
import { ethers } from "ethers";

import { snapshotGraphqlEndpoint } from "../config";

const vote = async (wallet, id, choice) => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);

    const msg = JSON.stringify({
      version: "0.1.3",
      timestamp: (Date.now() / 1e3).toFixed(),
      space: "everipediaiq.eth",
      type: "vote",
      payload: {
        proposal: id,
        choice,
        metadata: {}
      }
    });

    const sig = await provider.getSigner().signMessage(msg);

    const response = await fetch(`https://hub.snapshot.page/api/message`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ msg, sig, address: wallet.account })
    });

    await response.json();

    return 1;
  }
  return 0;
};

const getProposals = async first => {
  const { data } = await axios.post(
    snapshotGraphqlEndpoint,
    {
      query: `
    query Proposals {
      proposals(first: ${first}, skip: 0, where: {space_in: ["everipediaiq.eth"]}, orderBy: "created", orderDirection: desc) {
        id
        title
        body
        choices
        start
        end
        state
      }
    }
    `
    },
    { headers: { "Content-Type": "application/json" } }
  );

  return data.data.proposals;
};

const getVoteByVoter = async address => {
  const { data } = await axios.post(snapshotGraphqlEndpoint, {
    query: `
    query {
      votes(where: {voter: "${address}"}) {
        choice
      }
    }
    `
  });

  return data.data.votes[0];
};

const getVotes = async (id, first) => {
  const { data } = await axios.post(snapshotGraphqlEndpoint, {
    query: `
    query {
      votes(first: ${first}, skip: 0, where: {proposal: "${id}"}, orderBy: "created", orderDirection: desc) {
        choice
        voter
      }
    }    
    `
  });

  return data.data.votes;
};

const getScores = async addresses => {
  const { data } = await axios.post(snapshotGraphqlEndpoint, {
    query: `
      query {
        scores(space: "everipediaiq.eth", strategies: [{name: "erc20-balance-of", params: {address: "0x579cea1889991f68acc35ff5c3dd0621ff29b0c9", decimals: 18}, network: "1"}], network: "1", addresses: [${addresses}]) {
          scores
        }
      }
    `
  });

  return data.data.scores.scores[0];
};

export { getProposals, getVoteByVoter, getVotes, vote, getScores };
