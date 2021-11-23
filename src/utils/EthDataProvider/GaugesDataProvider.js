import { ethers } from "ethers";
import { gaugeControllerAbi } from "./gaugeController.abi";
import { stakingRewardsMultiGaugeAbi } from "./stakingRewardsMultiGauge.abi";
import { IUniswapV2PairAbi } from "./IUniswapV2Pair.abi";
import {
  gaugeControllerAddr,
  uniswapLpIqEth,
  uniswapLpIqFrax
} from "../../config";

const rpcURL = "https://a056-165-227-192-32.eu.ngrok.io";

const LPAddresses = [uniswapLpIqFrax, uniswapLpIqEth];

const getGaugesContract = (provider, getSigner) =>
  new ethers.Contract(
    gaugeControllerAddr,
    gaugeControllerAbi,
    getSigner ? provider.getSigner() : provider
  );

const getUniswapGaugeContract = (gaugeToUse, provider, getSigner = false) =>
  new ethers.Contract(
    gaugeToUse,
    stakingRewardsMultiGaugeAbi,
    getSigner ? provider.getSigner() : provider
  );

const getIUniswapV2PairContract = (gaugeToUse, provider, getSigner = false) =>
  new ethers.Contract(
    gaugeToUse,
    IUniswapV2PairAbi,
    getSigner ? provider.getSigner() : provider
  );

const needsApproval = async (provider, contract, amount, spender) => {
  const userAddress = await provider.getSigner().getAddress();
  const allowedTokens = await contract.allowance(userAddress, spender);
  if (allowedTokens.lt(amount)) {
    await contract.approve(spender, ethers.constants.MaxUint256);
  }
};

const getGauges = async () => {
  const provider = new ethers.providers.JsonRpcProvider(rpcURL);
  const gaugeController = getGaugesContract(provider, false);
  const gaugesNames = ["IQ/FRAX Uniswap V2", "IQ/ETH Uniswap V2"];

  let numberOfGauges = await gaugeController.n_gauges({ gasLimit: 500000 });
  numberOfGauges = Number(numberOfGauges.toString());

  let gauges = [];
  for (let i = 0; i < numberOfGauges; i++) {
    const address = await gaugeController.gauges(i, { gasLimit: 500000 });

    let gaugeWeight = await gaugeController.get_gauge_weight(address, {
      gasLimit: 400000
    });

    gaugeWeight = Number(ethers.utils.formatEther(gaugeWeight)).toFixed(2);

    gauges.unshift({
      address,
      name: gaugesNames[i],
      gaugeWeight,
      lpAddress: LPAddresses[i]
    });
  }

  return gauges;
};

const voteForGauge = async (wallet, gauge_addr, weight) => {
  if (wallet.status === "connected") {
    const signer = new ethers.providers.Web3Provider(
      wallet.ethereum
    ).getSigner();

    const gaugeControllerContract = new ethers.Contract(
      gaugeControllerAddr,
      gaugeControllerAbi,
      signer
    );

    const voteResult = await gaugeControllerContract.vote_for_gauge_weights(
      gauge_addr,
      weight,
      { gasLimit: 500000 }
    );

    return voteResult;
  }
};

const getLeftTimeToReVote = async (wallet, gauge_addr) => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);

    const gaugeController = getGaugesContract(provider, false);

    const gasEstimation = await gaugeController.estimateGas.last_user_vote(
      wallet.account,
      gauge_addr
    );

    const lastUserVote = await gaugeController.last_user_vote(
      wallet.account,
      gauge_addr,
      { gasLimit: gasEstimation }
    );
    const block = await provider.getBlock("latest");

    const blockTime = new Date(block.timestamp * 1000);
    const votedTimePlusDelay = new Date(
      (Number(lastUserVote.toString()) + 10 * 86400) * 1000
    );

    return { blockTime, nextVotingDate: votedTimePlusDelay };
  }
};

const getUserVotingPower = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);

    const gaugeControllerContract = getGaugesContract(provider, false);

    const gasEstimation =
      await gaugeControllerContract.estimateGas.vote_user_power(wallet.account);

    const power = await gaugeControllerContract.vote_user_power(
      wallet.account,
      {
        gasLimit: gasEstimation
      }
    );

    return Number(ethers.BigNumber.from(10000).sub(power).toString());
  }
};

// stakingRewardsMultiGauge

const getLpTokenBalance = async (wallet, gauge_addr) => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);

    const IUniswapV2PairContract = getIUniswapV2PairContract(
      gauge_addr,
      provider,
      true
    );
    const gasEstimation = await IUniswapV2PairContract.estimateGas.balanceOf(
      wallet.account
    );

    const result = await IUniswapV2PairContract.balanceOf(wallet.account, {
      gasLimit: gasEstimation
    });

    return Number(ethers.utils.formatEther(result));
  }
};

const stakeLockedLP = async (
  wallet,
  howManyLPTokens,
  howMuchTimeInSeconds,
  lp_gauge_addr,
  gauge_addr
) => {
  if (wallet.status === "connected") {
    const signer = new ethers.providers.Web3Provider(
      wallet.ethereum
    ).getSigner();

    const IUniswapV2PairContract = new ethers.Contract(
      lp_gauge_addr,
      IUniswapV2PairAbi,
      signer
    );

    await needsApproval(
      new ethers.providers.Web3Provider(wallet.ethereum),
      IUniswapV2PairContract,
      howManyLPTokens,
      gauge_addr
    );

    const uniswapGauge = new ethers.Contract(
      gauge_addr,
      stakingRewardsMultiGaugeAbi,
      signer
    );

    const gasEstimation = await uniswapGauge.estimateGas.stakeLocked(
      howManyLPTokens,
      howMuchTimeInSeconds
    );

    const result = await uniswapGauge.stakeLocked(
      howManyLPTokens,
      howMuchTimeInSeconds,
      { gasLimit: gasEstimation }
    );

    if (result) {
      await result.wait();
      return result.hash;
    }
  }
};

const getLockedStakes = async (wallet, gauge_addr) => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);
    const uniswapGauge = new ethers.Contract(
      gauge_addr,
      stakingRewardsMultiGaugeAbi,
      provider
    );

    const result = await uniswapGauge.lockedStakesOf(wallet.account);
    return result;
  }
};

const getEarned = async (wallet, gauge_addr) => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);
    const uniswapGauge = getUniswapGaugeContract(gauge_addr, provider, false);

    const earnedResult = await uniswapGauge.earned(wallet.account);
    return ethers.utils.formatEther(earnedResult[0].toString());
  }
  return 0;
};

const getReward = async (wallet, gauge_addr) => {
  if (wallet.status === "connected") {
    const signer = new ethers.providers.Web3Provider(
      wallet.ethereum
    ).getSigner();

    const uniswapGauge = new ethers.Contract(
      gauge_addr,
      stakingRewardsMultiGaugeAbi,
      signer
    );

    return await uniswapGauge.getReward();
  }
};

export {
  getGauges,
  voteForGauge,
  getLeftTimeToReVote,
  getUserVotingPower,
  getLpTokenBalance,
  stakeLockedLP,
  getLockedStakes,
  getEarned,
  getReward
};
