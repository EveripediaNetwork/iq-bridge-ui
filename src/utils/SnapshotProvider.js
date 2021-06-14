import axios from "axios";

import { snapshotGraphqlEndpoint } from "../config";

const vote = async wallet => {
  if (wallet.status === "connected") {
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

  console.log(data.data.proposals);
  return data.data.proposals;
};

export { getProposals, vote };
