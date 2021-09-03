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

// const WEEK = 604800;
const TOTAL_REWARDS_ACROSS_LOCK_PERIOD = 1000000 * 365;
// const STAKING_PERIODS_PER_YEAR = 31536000 / 604800;

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
    .mul(ethers.BigNumber.from(10000 + 2000))
    .div(ethers.BigNumber.from(10000));

const callCheckpoint = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);

    const hiIQRewards = getHiIQRewardsContract(provider, true);

    await hiIQRewards.checkpoint({ gasLimit: 800000 });
    return true;
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

const getYield = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const hiIQRewards = getHiIQRewardsContract(provider, true);

    const yieldResult = await hiIQRewards.getYield();
    return yieldResult;
  }

  return 0;
};

const getStats = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const erc20 = new ethers.Contract(iqAddress, erc20Abi, provider);
    const hiIQRewards = getHiIQRewardsContract(provider, true);
    const hiIQ = new ethers.Contract(hiIQAddress, hiIQAbi, provider);

    const totalValueLockedResult = await erc20["balanceOf(address)"](
      hiIQAddress
    );
    const totalhIIQSupply = await hiIQRewards.totalHiIQSupplyStored(); // review this supply
    const lockedResult = await hiIQ.locked(wallet.account, {
      gasLimit: 800000
    });
    console.log(ethers.utils.formatEther(lockedResult[1]));

    return {
      tvl: ethers.utils.formatEther(totalValueLockedResult),
      hiIQSupply: Number(ethers.utils.formatEther(totalhIIQSupply)),
      lockedByUser: Number(ethers.utils.formatEther(lockedResult[0])),
      rewardsAcrossLockPeriod: TOTAL_REWARDS_ACROSS_LOCK_PERIOD
    };
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

    const balanc = await erc20.balanceOf(wallet.account);
    return ethers.utils.formatEther(balanc);
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
      gasLimit: addGasLimitBuffer(
        await pTokens.estimateGas.redeem(amountParsed, eosAccount)
      )
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
        gasLimit: 800000
      });

      provider
        .waitForTransaction(result.hash)
        .then(() => handleConfirmation("success"))
        .catch(err => handleConfirmation(err));

      hashes.push(result.hash);
    }

    return hashes;
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

    // eslint-disable-next-line no-underscore-dangle
    return new Date(parseInt(result._hex, 16) * 1000);
  }

  return false;
};

const getMaximumLockableTime = async (wallet, lockEnd) => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const block = await provider.getBlock("latest");
    const max = new Date((block.timestamp + 4 * 365 * 86400) * 1000);

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
      gasLimit: addGasLimitBuffer(
        await hiIQ.estimateGas.increase_amount(amountParsed)
      )
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

const increaseUnlockTime = async (wallet, unlockTime, handleConfirmation) => {
  if (wallet.status === "connected") {
    const timeParsed = Math.floor(unlockTime / 1000.0);
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);

    const hiIQ = getHiIQContract(provider);

    const result = await hiIQ.increase_unlock_time(timeParsed, {
      gasLimit: addGasLimitBuffer(
        await hiIQ.estimateGas.increase_unlock_time(timeParsed)
      )
    });

    provider
      .waitForTransaction(result.hash)
      .then(() => handleConfirmation("success"))
      .catch(err => handleConfirmation(err));

    return result;
  }

  return 0;
};

export {
  callCheckpoint,
  earned,
  getYield,
  getStats,
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
  getTokensUserBalanceLocked
};
