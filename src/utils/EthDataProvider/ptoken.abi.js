export const ptokenAbi = [
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      {
        internalType: "string",
        name: "underlyingAssetRecipient",
        type: "string"
      }
    ],
    name: "redeem",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];
