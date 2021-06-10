import axios from "axios";

const vote = async wallet => {
  if (wallet.status === "connected") {
    return 1;
  }
  return 0;
};

const getProposals = async () => {
  const { data } = await axios.post(
    "https://hub.snapshot.page/graphql",
    {
      query: `
    query Proposals {
      proposals(first: 20, skip: 0, where: {space_in: ["everipediaiq.eth"]}, orderBy: "created", orderDirection: desc) {
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

export { getProposals, vote };
