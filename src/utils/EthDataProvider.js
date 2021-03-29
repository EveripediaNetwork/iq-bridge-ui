import { ethers } from "ethers";

const minterAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const erc20Abi = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// const pIQAddress = "0xbff1365cf0a67431484c00c63bf14cfd9abbce5d"; // GOERLI
// const pMinterAddress = "0x483488B7D897b429AE851FEef1fA02d96475cc23"; // GOERLI
const pIQAddress = "0xa23d33d5e0a61ba81919bfd727c671bb03ab0fea";
const pMinterAddress = "0xa23d33d5e0a61ba81919bfd727c671bb03ab0fea";

const getPTokensUserBalance = async (wallet) => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const erc20 = new ethers.Contract(pIQAddress, erc20Abi, provider);
    const balanc = await erc20.balanceOf(wallet.account);
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
    await erc20.approve(pMinterAddress, amountParsed, { gasLimit: 100000 });
    await pMinter.mint(amountParsed, { gasLimit: 200000 });
    return true;
  }
  return false;
};

export { convertPTokensTx, getPTokensUserBalance };
