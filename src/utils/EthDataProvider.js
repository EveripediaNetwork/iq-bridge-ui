import { ethers } from "ethers";

const minterAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const erc20Abi = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256"
      }
    ],
    payable: false,
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
];

// TODO: abis move to individual files // add more methods if needed
const hiIQAbi = [
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

// const pIQAddress = "0xbff1365cf0a67431484c00c63bf14cfd9abbce5d"; // GOERLI
// const pMinterAddress = "0x483488B7D897b429AE851FEef1fA02d96475cc23"; // GOERLI
const maticIQAddress = "0xB9638272aD6998708de56BBC0A290a1dE534a578";
const maticHiIQAddress = "0xfC0fA725E8fB4D87c38EcE56e8852258219C64Ee";
const pIQAddress = "0xa23d33d5e0a61ba81919bfd727c671bb03ab0fea";
const pMinterAddress = "0x30953aebf5e3f2c139e9e19bf246dd3a575ddaf7";

const getPTokensUserBalance = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const erc20 = new ethers.Contract(pIQAddress, erc20Abi, provider);
    const balanc = await erc20.balanceOf(wallet.account);
    return ethers.utils.formatEther(balanc);
  }
  return 0;
};

const getTokensUserBalanceMatic = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const erc20 = new ethers.Contract(maticIQAddress, erc20Abi, provider);
    const balanc = await erc20.balanceOf(wallet.account);
    return ethers.utils.formatEther(balanc);
  }
  return 0;
};

const getTokensUserBalanceMaticLocked = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const hiIQ = new ethers.Contract(
      maticHiIQAddress,
      hiIQAbi,
      provider.getSigner()
    );

    const balanc = await hiIQ["balanceOf(address)"](wallet.account);
    return ethers.utils.formatEther(balanc);
  }
  return 0;
};

const convertPTokensTx = async (amount, wallet) => {
  const amountParsed = ethers.utils.parseEther(amount).toString();
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const erc20 = new ethers.Contract(
      pIQAddress,
      erc20Abi,
      provider.getSigner()
    );
    const pMinter = new ethers.Contract(
      pMinterAddress,
      minterAbi,
      provider.getSigner()
    );
    await erc20.approve(pMinterAddress, amountParsed, { gasLimit: 70000 });
    await pMinter.mint(amountParsed, { gasLimit: 125000 });
    return true;
  }
  return false;
};

const lockTokensTx = async (amount, time, wallet) => {
  const amountParsed = ethers.utils.parseEther(amount).toString();
  const timeParsed = ethers.utils.parseEther(time).toString();
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const erc20 = new ethers.Contract(
      maticIQAddress,
      erc20Abi,
      provider.getSigner()
    );
    const hiIQ = new ethers.Contract(
      maticHiIQAddress,
      hiIQAbi,
      provider.getSigner()
    );

    await erc20.approve(maticHiIQAddress, amountParsed, { gasLimit: 700000 });
    await hiIQ.create_lock(amountParsed, timeParsed, {
      gasLimit: 700000
    });

    return true;
  }
  return false;
};

const increaseAmount = async (amount, wallet) => {
  const amountParsed = ethers.utils.parseEther(amount).toString();

  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const erc20 = new ethers.Contract(
      maticIQAddress,
      erc20Abi,
      provider.getSigner()
    );
    const hiIQ = new ethers.Contract(
      maticHiIQAddress,
      hiIQAbi,
      provider.getSigner()
    );

    await erc20.approve(maticHiIQAddress, amountParsed, { gasLimit: 700000 });
    await hiIQ.increase_amount(amountParsed, {
      gasLimit: 700000
    });
  }
};

export {
  convertPTokensTx,
  getPTokensUserBalance,
  getTokensUserBalanceMatic,
  lockTokensTx,
  increaseAmount,
  getTokensUserBalanceMaticLocked
};
