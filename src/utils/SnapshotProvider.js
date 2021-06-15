import axios from "axios";
import { ethers } from "ethers";

import { snapshotGraphqlEndpoint } from "../config";

const vote = async (wallet, id, choice, address) => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);

    provider
      .getSigner()
      .signTransaction({ type: "vote", from: wallet.account });
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
      proposals(first: ${first}, skip: 0, where: {space_in: ["everipediaiq.eth"]}, orderBy: "created", orderDirection: asc) {
        id
        title
        body
        choices
        start
        end
        snapshot
        state
        author
        space {
          id
          name
        }
      }
    }
    `
    },
    { headers: { "Content-Type": "application/json" } }
  );

  return data.data.proposals;
};

const getVotes = async (id, first) => {
  const { data } = await axios.post(snapshotGraphqlEndpoint, {
    query: `
    query {
      votes(first: ${first}, skip: 0, where: {proposal: "${id}"}, orderBy: "created", orderDirection: desc) {
        choice
      }
    }    
    `
  });

  return data.data.votes;
};

export { getProposals, getVotes, vote };
