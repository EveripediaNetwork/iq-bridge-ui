import { ethers } from "ethers";
import { erc20Abi } from "./erc20.abi";
import { hiIQAbi } from "./hiIQ.abi";
import { minterAbi } from "./minter.abi";

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

const increaseAmount = async (amount, wallet, handleConfirmation) => {
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
    const result = await hiIQ.increase_amount(amountParsed, {
      gasLimit: 700000
    });

    provider
      .waitForTransaction(result.hash)
      .then(() => handleConfirmation("success"))
      .catch(err => handleConfirmation(err));
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
