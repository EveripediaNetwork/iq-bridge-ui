import { ethers } from "ethers";
import { erc20Abi } from "./erc20.abi";
import { hiIQAbi } from "./hiIQ.abi";
import { minterAbi } from "./minter.abi";

// TODO: move to .env so we can have dev & prod addresses
// const iQAddress = "0x0552D756a3E92Aa874EF60F61b7a29030373e869"; // GOERLI
// const hiIQAddress = "0xc03bcacc5377b7cc6634537650a7a1d14711c1a3"; // GOERLI
// const pIQAddress = "0xbff1365cf0a67431484c00c63bf14cfd9abbce5d"; // GOERLI
// const pMinterAddress = "0x483488B7D897b429AE851FEef1fA02d96475cc23"; // GOERLI

const iQAddress = "0x579cea1889991f68acc35ff5c3dd0621ff29b0c9";
const hiIQAddress = "0x1bf5457ecaa14ff63cc89efd560e251e814e16ba";
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

const getTokensUserBalance = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const erc20 = new ethers.Contract(iQAddress, erc20Abi, provider);
    const balanc = await erc20.balanceOf(wallet.account);
    return ethers.utils.formatEther(balanc);
  }
  return 0;
};

const getTokensUserBalanceLocked = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const hiIQ = new ethers.Contract(
      hiIQAddress,
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
    await erc20.approve(pMinterAddress, amountParsed);
    await pMinter.mint(amountParsed, { gasLimit: 125000 });
    return true;
  }
  return false;
};

const lockTokensTx = async (amount, time, wallet) => {
  const amountParsed = ethers.utils.parseEther(amount).toString();
  const d = new Date();
  d.setDate(d.getDate() + time);

  const timeParsed = Math.floor(d.getTime() / 1000.0);
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const erc20 = new ethers.Contract(
      iQAddress,
      erc20Abi,
      provider.getSigner()
    );
    const hiIQ = new ethers.Contract(
      hiIQAddress,
      hiIQAbi,
      provider.getSigner()
    );

    await erc20.approve(hiIQAddress, amountParsed);
    await hiIQ.create_lock(amountParsed, String(timeParsed), {
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
      iQAddress,
      erc20Abi,
      provider.getSigner()
    );
    const hiIQ = new ethers.Contract(
      hiIQAddress,
      hiIQAbi,
      provider.getSigner()
    );

    await erc20.approve(hiIQAddress, amountParsed);
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
  getTokensUserBalance,
  lockTokensTx,
  increaseAmount,
  getTokensUserBalanceLocked
};
