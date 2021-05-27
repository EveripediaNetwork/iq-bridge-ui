export const hiIQAbi = [
  {
    name: "deposit_for",
    outputs: [],
    inputs: [
      {
        type: "address",
        name: "_addr"
      },
      {
        type: "uint256",
        name: "_value"
      }
    ],
    stateMutability: "nonpayable",
    type: "function",
    gas: 92414024
  },
  {
    name: "create_lock",
    outputs: [],
    inputs: [
      {
        type: "uint256",
        name: "_value"
      },
      {
        type: "uint256",
        name: "_unlock_time"
      }
    ],
    stateMutability: "nonpayable",
    type: "function",
    gas: 92415425
  },
  {
    name: "increase_amount",
    outputs: [],
    inputs: [
      {
        type: "uint256",
        name: "_value"
      }
    ],
    stateMutability: "nonpayable",
    type: "function",
    gas: 92414846
  },
  {
    name: "increase_unlock_time",
    outputs: [],
    inputs: [
      {
        type: "uint256",
        name: "_unlock_time"
      }
    ],
    stateMutability: "nonpayable",
    type: "function",
    gas: 92415493
  },
  {
    name: "withdraw",
    outputs: [],
    inputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: 46291332
  },
  {
    name: "balanceOf",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "address",
        name: "addr"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    name: "balanceOf",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "address",
        name: "addr"
      },
      {
        type: "uint256",
        name: "_t"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    name: "balanceOfAt",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "address",
        name: "addr"
      },
      {
        type: "uint256",
        name: "_block"
      }
    ],
    stateMutability: "view",
    type: "function",
    gas: 512868
  },
  {
    name: "totalSupply",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [],
    stateMutability: "view",
    type: "function"
  },
  {
    name: "totalSupply",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "uint256",
        name: "t"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    name: "totalSupplyAt",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "uint256",
        name: "_block"
      }
    ],
    stateMutability: "view",
    type: "function",
    gas: 882020
  },
  {
    name: "totalIQSupply",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [],
    stateMutability: "view",
    type: "function",
    gas: 2116
  },
  {
    name: "totalIQSupplyAt",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "uint256",
        name: "_block"
      }
    ],
    stateMutability: "view",
    type: "function",
    gas: 252170
  }
];
