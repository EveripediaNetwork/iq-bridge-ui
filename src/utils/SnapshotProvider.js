const vote = async wallet => {
  if (wallet.status === "connected") {
    return 1;
  }
  return 0;
};

const getProposals = async () => {
  return [
    {
      id: 1,
      name: "Lorem ipso"
    }
  ];
};

export { getProposals, vote };
