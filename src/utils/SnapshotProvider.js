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
  const aux = {
    params: {
      space: "everipediaiq.eth",
      network: "1",
      snapshot: 12638103,
      strategies: [
        {
          name: "multichain",
          params: {
            graphs: {
              56: "https://api.thegraph.com/subgraphs/name/apyvision/block-info",
              137: "https://api.thegraph.com/subgraphs/name/sameepsi/maticblocks"
            },
            symbol: "IQ",
            strategies: [
              {
                name: "erc20-balance-of",
                params: {
                  address: "0x579cea1889991f68acc35ff5c3dd0621ff29b0c9",
                  decimals: 18
                },
                network: "1"
              },
              {
                name: "erc20-balance-of",
                params: {
                  address: "0xB9638272aD6998708de56BBC0A290a1dE534a578",
                  decimals: 18
                },
                network: "137"
              },
              {
                name: "erc20-balance-of",
                params: {
                  address: "0x0e37d70b51ffa2b98b4d34a5712c5291115464e3",
                  decimals: 18
                },
                network: "56"
              },
              {
                name: "erc20-balance-of",
                params: {
                  address: "0xfC0fA725E8fB4D87c38EcE56e8852258219C64Ee",
                  decimals: 18
                },
                network: 137
              }
            ]
          },
          __typename: "Strategy"
        }
      ],
      addresses
    }
  };

  const { data } = await axios.post(
    "https://score.snapshot.org/api/scores",
    JSON.stringify(aux),
    {
      headers: {
        "Content-type": "application/json"
      }
    }
  );

  return data.result.scores[0];
};

export { getProposals, getVoteByVoter, getVotes, vote, getScores };
