import { createContext } from "react";

export const ProposalContext = createContext({
  proposals: undefined,
  setProposals: () => {},
  selectedProposal: undefined,
  setSelectedProposal: () => {}
});
