import { ethers } from "ethers";
import { gaugeControllerAbi } from "./gaugeController.abi";
import { stakingRewardsMultiGaugeAbi } from "./stakingRewardsMultiGauge.abi";
import { IUniswapV2PairAbi } from "./IUniswapV2Pair.abi";

const rpcURL = "https://4ea3-165-227-192-32.eu.ngrok.io";

const GAUGE_CONTROLLER_ADDR = "0x2b308cd243074e2f4a709e12c26039acecd4daa7";
const REWARDS_DIST_ADDR = "0xc2cd962e53afcdf574b409599a24724efbadb3d4";

// const UNI_GAUGE_FRAX_IQ_ADDR = "0x839055d0fbee415e665dc500dd2af292c0692305";
const UNISWAP_LP_IQ_FRAX = "0xd6c783b257e662ca949b441a4fcb08a53fc49914";
// const UNISWAP_LP_IQ_FRAX = "0x839055d0fbee415e665dc500dd2af292c0692305";

// const UNI_GAUGE_ETH_IQ_ADDR = "0x65237882dd5fbb85d865eff3be26ac4e67da87aa";
const UNISWAP_LP_IQ_ETH = "0xef9f994a74cb6ef21c38b13553caa2e3e15f69d0";

const LPAddresses = [UNISWAP_LP_IQ_FRAX, UNISWAP_LP_IQ_ETH];

const getGaugesContract = (provider, getSigner) =>
  new ethers.Contract(
    GAUGE_CONTROLLER_ADDR,
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

const getGauges = async () => {
  const provider = new ethers.providers.JsonRpcProvider(rpcURL);
  console.log(provider);
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
      GAUGE_CONTROLLER_ADDR,
      gaugeControllerAbi,
      signer
    );

    const voteResult = await gaugeControllerContract.vote_for_gauge_weights(
      gauge_addr,
      weight,
      { gasLimit: 500000 }
    );

    console.log(voteResult);
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

// const getVoteUserSlopes = async wallet => {
//   if (wallet.status === "connected") {
//     const provider = new ethers.providers.JsonRpcProvider(rpcURL);
//     const gaugeControllerContract = getGaugesContract(provider, false);

//     const slope = await gaugeControllerContract.vote_user_slopes(
//       wallet.account,
//       UNI_GAUGE_ETH_IQ_ADDR,
//       { gasLimit: 100000 }
//     );
//     console.log(slope);
//     console.log(new Date(Number(slope.end.toString()) * 1000));
//     console.log(slope.power.toString());
//     console.log(slope.slope.toString());
//     console.log(Number(ethers.utils.formatEther(slope.slope)));
//   }
// };

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

    return Number(power.toString());
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
    // const provider = new ethers.providers.JsonRpcProvider(rpcURL);

    const signer = new ethers.providers.Web3Provider(
      wallet.ethereum
    ).getSigner();

    const IUniswapV2PairContract = new ethers.Contract(
      lp_gauge_addr,
      IUniswapV2PairAbi,
      signer
    );

    await (
      await IUniswapV2PairContract.approve(gauge_addr, howManyLPTokens)
    ).wait();

    const uniswapGauge = new ethers.Contract(
      gauge_addr,
      stakingRewardsMultiGaugeAbi,
      signer
    );

    console.log(howMuchTimeInSeconds);

    // const gasEstimation = await uniswapGauge.estimateGas.stakeLocked(
    //   parsedAmount,
    //   howMuchTimeInSeconds
    // );

    const result = await uniswapGauge.stakeLocked(
      howManyLPTokens,
      howMuchTimeInSeconds,
      { gasLimit: 500000 }
    );
    console.log(await result.wait());
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
    console.log(result);
  }
};

export {
  getGauges,
  voteForGauge,
  getLeftTimeToReVote,
  getUserVotingPower,
  getLpTokenBalance,
  stakeLockedLP,
  getLockedStakes
};
