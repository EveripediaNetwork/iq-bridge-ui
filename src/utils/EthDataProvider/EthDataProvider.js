import { ethers } from "ethers";

import {
  hiIQAddress,
  iqAddress,
  pIQAddress,
  pMinterAddress,
  hiIQRewardsAddress,
  jsonRPCNodeLink
} from "../../config";
import { erc20Abi } from "./erc20.abi";
import { hiIQAbi } from "./hiIQ.abi";
import { HiIQRewardsAbi } from "./hiIQRewards.abi";
import { minterAbi } from "./minter.abi";
import { ptokenAbi } from "./ptoken.abi";

const TOTAL_REWARDS_ACROSS_LOCK_PERIOD = 1000000 * 365;

const getHiIQContract = provider =>
  new ethers.Contract(hiIQAddress, hiIQAbi, provider.getSigner());

const getERC20IQContract = provider =>
  new ethers.Contract(iqAddress, erc20Abi, provider.getSigner());

const getERC20PIQ = provider =>
  new ethers.Contract(pIQAddress, erc20Abi, provider.getSigner());

const getPMinter = provider =>
  new ethers.Contract(pMinterAddress, minterAbi, provider.getSigner());

const getHiIQRewardsContract = (provider, getSigner) =>
  new ethers.Contract(
    hiIQRewardsAddress,
    HiIQRewardsAbi,
    getSigner ? provider.getSigner() : provider
  );

const addGasLimitBuffer = value =>
  value
    .mul(ethers.BigNumber.from(10000 + 2500))
    .div(ethers.BigNumber.from(10000));

const checkIfUserIsInitialized = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);

    const hiIQRewards = getHiIQRewardsContract(provider, true);

    const result = await hiIQRewards.userIsInitialized(wallet.account);

    return result;
  }

  return undefined;
};

const callCheckpoint = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);

    const hiIQRewards = getHiIQRewardsContract(provider, true);

    const result = await hiIQRewards.checkpoint({
      gasLimit: addGasLimitBuffer(await hiIQRewards.estimateGas.checkpoint())
    });
    return result;
  }
  return 0;
};

const earned = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);

    const hiIQRewards = getHiIQRewardsContract(provider, false);
    const balance = await hiIQRewards.earned(wallet.account);

    return ethers.utils.formatEther(balance);
  }

  return 0;
};

const defaultStats = async () => {
  const provider = new ethers.providers.JsonRpcProvider(jsonRPCNodeLink);
  const erc20 = new ethers.Contract(iqAddress, erc20Abi, provider);
  const hiIQ = new ethers.Contract(hiIQAddress, hiIQAbi, provider);

  const totalValueLockedResult = await erc20["balanceOf(address)"](hiIQAddress);
  const totalhIIQSupply = await hiIQ["totalSupply()"]();
  return {
    tvl: ethers.utils.formatEther(totalValueLockedResult),
    hiIQSupply: Number(ethers.utils.formatEther(totalhIIQSupply)),
    rewardsAcrossLockPeriod: TOTAL_REWARDS_ACROSS_LOCK_PERIOD
  };
};

const getYield = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const hiIQRewards = getHiIQRewardsContract(provider, true);

    const yieldResult = await hiIQRewards.getYield({ gasLimit: 500000 });
    return yieldResult;
  }

  return 0;
};

const getStats = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const erc20 = new ethers.Contract(iqAddress, erc20Abi, provider);
    const hiIQ = new ethers.Contract(hiIQAddress, hiIQAbi, provider);

    const totalValueLockedResult = await erc20["balanceOf(address)"](
      hiIQAddress
    );
    const totalhIIQSupply = await hiIQ["totalSupply()"]();

    const lockedResult = await hiIQ.locked(wallet.account, {
      gasLimit: 400000
    });

    return {
      tvl: ethers.utils.formatEther(totalValueLockedResult),
      hiIQSupply: Number(ethers.utils.formatEther(totalhIIQSupply)),
      lockedByUser: Number(ethers.utils.formatEther(lockedResult[0])),
      rewardsAcrossLockPeriod: TOTAL_REWARDS_ACROSS_LOCK_PERIOD
    };
  }

  return 0;
};

const getIQLockedByTheUser = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const hiIQ = getHiIQContract(provider);
    const result = await hiIQ.locked(wallet.account, {
      gasLimit: 125000
    });

    return ethers.utils.formatEther(result[0]);
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
    const erc20 = getERC20PIQ(provider);
    const balanc = await erc20.balanceOf(wallet.account);
    return ethers.utils.formatEther(balanc);
  }
  return 0;
};

const getTokensUserBalance = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);

    const erc20 = getERC20IQContract(provider);

    let balance = await erc20.balanceOf(wallet.account);
    balance = Number(ethers.utils.formatEther(balance));

    return balance > 0.01 ? balance : 0;
  }
  return 0;
};

const getTokensUserBalanceLocked = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const hiIQ = new ethers.Contract(hiIQAddress, hiIQAbi, provider);

    const balanc = await hiIQ["balanceOf(address)"](wallet.account);
    return ethers.utils.formatEther(balanc);
  }
  return 0;
};

const convertPTokensTx = async (amount, wallet) => {
  const amountParsed = ethers.utils.parseEther(amount).toString();
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);

    const erc20 = getERC20PIQ(provider);

    const pMinter = getPMinter(provider);

    const hashes = await needsApproval(
      provider,
      erc20,
      amountParsed,
      pMinterAddress,
      []
    );

    const result = await pMinter.mint(amountParsed, {
      gasLimit: addGasLimitBuffer(await pMinter.estimateGas.mint(amountParsed))
    });
    hashes.push(result.hash);

    return hashes;
  }
  return false;
};

const reverseIQtoEOSTx = async (amount, wallet, eosAccount) => {
  const amountParsed = ethers.utils.parseEther(amount).toString();
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);

    const erc20 = getERC20IQContract(provider);

    const pTokens = new ethers.Contract(
      pIQAddress,
      ptokenAbi,
      provider.getSigner()
    );

    const pMinter = getPMinter(provider);

    await needsApproval(provider, erc20, amountParsed, pMinterAddress, []);
    await pMinter.burn(amountParsed);

    await pTokens.redeem(amountParsed, eosAccount, {
      gasLimit: 50000
    });

    return true;
  }

  return false;
};

const lockTokensTx = async (amount, time, wallet, handleConfirmation) => {
  const amountParsed = ethers.utils.parseEther(amount).toString();
  const d = new Date();
  d.setDate(d.getDate() + time);

  const timeParsed = Math.floor(d.getTime() / 1000.0);
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);

    const erc20 = getERC20IQContract(provider);
    const hiIQ = getHiIQContract(provider);

    const hashes = await needsApproval(
      provider,
      erc20,
      amountParsed,
      hiIQAddress,
      []
    );

    if (hashes) {
      const result = await hiIQ.create_lock(amountParsed, String(timeParsed), {
        gasLimit: 600000
      });

      provider
        .waitForTransaction(result.hash)
        .then(() => handleConfirmation("success"))
        .catch(err => handleConfirmation(err));

      hashes.push(result.hash);

      return { result, hashes };
    }

    return { hashes };
  }

  return false;
};

const withdraw = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const hiIQ = getHiIQContract(provider);

    const result = await hiIQ.withdraw({
      gasLimit: addGasLimitBuffer(await hiIQ.estimateGas.withdraw())
    });

    return result;
  }

  return false;
};

const getLockedEnd = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const hiIQ = getHiIQContract(provider);

    const result = await hiIQ.locked__end(wallet.account);

    const date = new Date(Number(result.toString()) * 1000);
    return date;
  }

  return false;
};

const getMaximumLockableTime = async (wallet, lockEnd) => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const block = await provider.getBlock("latest");
    const max = new Date((block.timestamp + 4 * 365 * 86400) * 1000);
    max.setHours(0);
    max.setMinutes(0);
    max.setSeconds(0);

    const diffTime = Math.abs(max - lockEnd);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays - 1;
  }
  return false;
};

const increaseAmount = async (amount, wallet, handleConfirmation) => {
  const amountParsed = ethers.utils.parseEther(amount).toString();

  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const erc20 = getERC20IQContract(provider);

    const hiIQ = getHiIQContract(provider);

    const hashes = await needsApproval(
      provider,
      erc20,
      amountParsed,
      hiIQAddress,
      []
    );

    const result = await hiIQ.increase_amount(amountParsed, {
      gasLimit: 500000
    });

    hashes.push(result.hash);

    provider
      .waitForTransaction(result.hash)
      .then(() => handleConfirmation("success"))
      .catch(err => handleConfirmation(err));

    return { result, hashes };
  }

  return false;
};

const avoidMaxTimeUnlockTime = unlockTime => {
  let timeParsed = unlockTime / 1000.0;
  const today = new Date().getTime() / 1000;
  const diff = timeParsed - today;

  // if somehow its longer than 4 years round to 4 years and give 30 min. for minting the tx
  if (Math.floor(diff / (3600 * 24)) / 365 > 4)
    timeParsed = Math.ceil(today + 86400 * 4 * 365 - 60 * 30);

  return timeParsed;
};

const increaseUnlockTime = async (wallet, unlockTime, handleConfirmation) => {
  if (wallet.status === "connected") {
    const timeParsed = avoidMaxTimeUnlockTime(unlockTime);
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);

    const hiIQ = getHiIQContract(provider);

    const result = await hiIQ.increase_unlock_time(timeParsed, {
      gasLimit: 500000
    });

    provider
      .waitForTransaction(result.hash)
      .then(() => handleConfirmation("success"))
      .catch(err => handleConfirmation(err));

    return { result };
  }

  return 0;
};

export {
  checkIfUserIsInitialized,
  callCheckpoint,
  earned,
  getYield,
  getStats,
  getIQLockedByTheUser,
  convertPTokensTx,
  getPTokensUserBalance,
  getTokensUserBalance,
  reverseIQtoEOSTx,
  withdraw,
  getLockedEnd,
  lockTokensTx,
  increaseAmount,
  getMaximumLockableTime,
  increaseUnlockTime,
  getTokensUserBalanceLocked,
  defaultStats
};
