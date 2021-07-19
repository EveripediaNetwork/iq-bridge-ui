import { ethers } from "ethers";

import {
  hiIQAddress,
  iqAddress,
  pIQAddress,
  pMinterAddress,
  hiIQRewardsAddress
} from "../../config";
import { erc20Abi } from "./erc20.abi";
import { hiIQAbi } from "./hiIQ.abi";
import { HiIQRewardsAbi } from "./hiIQRewards.abi";
import { minterAbi } from "./minter.abi";
import { ptokenAbi } from "./ptoken.abi";

const earned = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const hiIQRewards = new ethers.Contract(
      hiIQRewardsAddress,
      HiIQRewardsAbi,
      provider.getSigner()
    );

    const balance = await hiIQRewards.earned(wallet.account);
    return ethers.utils.formatEther(balance);
  }

  return 0;
};

const getYield = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const hiIQRewards = new ethers.Contract(
      hiIQRewardsAddress,
      HiIQRewardsAbi,
      provider.getSigner()
    );

    const yieldResult = await hiIQRewards.getYield();
    return yieldResult;
  }

  return 0;
};

const needsApproval = async (provider, erc20, amount, spender, hashes) => {
  const userAddress = await provider.getSigner().getAddress();
  const allowedTokens = await erc20.allowance(userAddress, spender);
  if (allowedTokens.lt(amount)) {
    const approveResult = await erc20.approve(
      spender,
      ethers.constants.MaxUint256
    );
    hashes.push(approveResult.hash);
  }

  return hashes;
};

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
    const hashes = await needsApproval(
      provider,
      erc20,
      amountParsed,
      pMinterAddress,
      []
    );

    const result = await pMinter.mint(amountParsed, { gasLimit: 125000 });
    hashes.push(result.hash);

    return hashes;
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
    await needsApproval(provider, erc20, amountParsed, pMinterAddress, []);
    await pMinter.burn(amountParsed);
    await pTokens.redeem(amountParsed, eosAccount, { gasLimit: 50000 });

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
      iqAddress,
      erc20Abi,
      provider.getSigner()
    );
    const hiIQ = new ethers.Contract(
      hiIQAddress,
      hiIQAbi,
      provider.getSigner()
    );

    const hashes = await needsApproval(
      provider,
      erc20,
      amountParsed,
      hiIQAddress,
      []
    );
    const result = await hiIQ.create_lock(amountParsed, String(timeParsed), {
      gasLimit: 700000
    });

    hashes.push(result.hash);

    return hashes;
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

    const hashes = await needsApproval(
      provider,
      erc20,
      amountParsed,
      hiIQAddress,
      []
    );

    const result = await hiIQ.increase_amount(amountParsed, {
      gasLimit: 700000000
    });

    hashes.push(result.hash);

    provider
      .waitForTransaction(result.hash)
      .then(() => handleConfirmation("success"))
      .catch(err => handleConfirmation(err));

    return hashes;
  }

  return false;
};

export {
  earned,
  getYield,
  convertPTokensTx,
  getPTokensUserBalance,
  getTokensUserBalance,
  reverseIQtoEOSTx,
  lockTokensTx,
  increaseAmount,
  getTokensUserBalanceLocked
};
