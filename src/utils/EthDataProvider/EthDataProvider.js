import { ethers } from "ethers";

import {
  iqAddress,
  hiIQAddress,
  pIQAddress,
  pMinterAddress
} from "../../config";
import { erc20Abi } from "./erc20.abi";
import { hiIQAbi } from "./hiIQ.abi";
import { minterAbi } from "./minter.abi";
import { ptokenAbi } from "./ptoken.abi";

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
    const erc20 = new ethers.Contract(iqAddress, erc20Abi, provider);
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

const reverseIQtoEOSTx = async (amount, wallet, eosAccount) => {
  const amountParsed = ethers.utils.parseEther(amount).toString();
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const erc20 = new ethers.Contract(
      iqAddress,
      erc20Abi,
      provider.getSigner()
    );
    const pTokens = new ethers.Contract(
      pIQAddress,
      ptokenAbi,
      provider.getSigner()
    );
    const pMinter = new ethers.Contract(
      pMinterAddress,
      minterAbi,
      provider.getSigner()
    );
    await erc20.approve(pMinterAddress, amountParsed);
    await pMinter.burn(amountParsed, { gasLimit: 125000 }); // TODO: check gas
    return pTokens.redeem(amountParsed, eosAccount); // TODO: check gas
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
      iqAddress,
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
      iqAddress,
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
  reverseIQtoEOSTx,
  lockTokensTx,
  increaseAmount,
  getTokensUserBalanceLocked
};
