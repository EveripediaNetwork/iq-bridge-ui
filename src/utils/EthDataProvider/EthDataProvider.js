import { ethers } from "ethers";

import {
  hiIQAddress,
  iqAddress,
  pIQAddress,
  pMinterAddress,
  feeDistributorAddress
} from "../../config";
import { erc20Abi } from "./erc20.abi";
import { hiIQAbi } from "./hiIQ.abi";
import { feeDistributorAbi } from "./feeDistributor.abi";
import { minterAbi } from "./minter.abi";
import { ptokenAbi } from "./ptoken.abi";

const WEEK = 604800;

const getHiIQContract = provider =>
  new ethers.Contract(hiIQAddress, hiIQAbi, provider.getSigner());

const getERC20IQContract = provider =>
  new ethers.Contract(iqAddress, erc20Abi, provider.getSigner());

const getERC20PIQ = provider =>
  new ethers.Contract(pIQAddress, erc20Abi, provider.getSigner());

const getPMinter = provider =>
  new ethers.Contract(pMinterAddress, minterAbi, provider.getSigner());

const addGasLimitBuffer = value =>
  value
    .mul(ethers.BigNumber.from(10000 + 2000))
    .div(ethers.BigNumber.from(10000));

const getStats = async (wallet, timeCursor) => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const erc20 = new ethers.Contract(iqAddress, erc20Abi, provider);

    const feeDistributor = new ethers.Contract(
      feeDistributorAddress,
      feeDistributorAbi,
      provider
    );

    const totalValueLockedResult = await erc20["balanceOf(address)"](
      hiIQAddress
    );

    const time = timeCursor.sub(WEEK * 2);
    const yourHiIQ = await feeDistributor.hiIQForAt(wallet.account, time);
    let data = ethers.BigNumber.from(0);
    if (yourHiIQ.gt(0)) {
      const result2 = await feeDistributor.hiIQSupply(time);
      if (result2.gt(0)) {
        const result3 = await feeDistributor.tokensPerWeek(time);
        data = data.add(yourHiIQ.mul(result3).div(result2));
      }
    }
    const yourDailyRewards = data.div(7);

    return {
      yourDailyRewards,
      tvl: ethers.utils.formatEther(totalValueLockedResult)
    };
  }

  return 0;
};

const getFeeDistributorCursor = async wallet => {
  const provider = new ethers.providers.Web3Provider(wallet.ethereum);

  if (wallet.status === "connected") {
    const feeDistributor = new ethers.Contract(
      feeDistributorAddress,
      feeDistributorAbi,
      provider
    );

    return feeDistributor.timeCursor();
  }

  return 0;
};

const getRewardsForTimeCursor = async (wallet, timeCursor) => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);

    const feeDistributor = new ethers.Contract(
      feeDistributorAddress,
      feeDistributorAbi,
      provider
    );
    let data = ethers.BigNumber.from(0);
    let time = await feeDistributor.startTime();
    const address = wallet.account;

    const currentCursor = await feeDistributor.timeCursorOf(address);
    while (time.lt(timeCursor.sub(WEEK))) {
      // if user didnt claim
      if (currentCursor.lt(time)) {
        // eslint-disable-next-line no-await-in-loop
        const result = await feeDistributor.hiIQForAt(address, time);
        if (result.gt(0)) {
          // eslint-disable-next-line no-await-in-loop
          const result2 = await feeDistributor.hiIQSupply(time);
          if (result2.gt(0)) {
            // eslint-disable-next-line no-await-in-loop
            const result3 = await feeDistributor.tokensPerWeek(time);
            data = data.add(result.mul(result3).div(result2));
          }
        }
      }

      // console.log(time.toString());
      // console.log(new Date(time.toString() * 1000));

      time = time.add(WEEK);
    }

    return ethers.utils.formatEther(data);
  }

  return 0;
};

const claim = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);

    const feeDistributor = new ethers.Contract(
      feeDistributorAddress,
      feeDistributorAbi,
      provider.getSigner()
    );

    const result = await feeDistributor.claim(wallet.account, {
      gasLimit: 800000
    });

    return result;
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
  getStats,
  getRewardsForTimeCursor,
  claim,
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
  getFeeDistributorCursor
};
