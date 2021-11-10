import { ethers } from "ethers";
import { gaugeControllerAbi } from "./gaugeController.abi";

const rpcURL = "https://0039-165-227-192-32.eu.ngrok.io";

const GAUGE_CONTROLLER_ADDR = "0xc2cd962e53afcdf574b409599a24724efbadb3d4";
const REWARDS_DIST_ADDR = "0x839055d0fbee415e665dc500dd2af292c0692305";
const UNI_GAUGE_FRAX_IQ_ADDR = "0x65237882dd5fbb85d865eff3be26ac4e67da87aa";
const UNI_GAUGE_ETH_IQ_ADDR = "0x2c477a64d2cb9f340e1f72ff76399432559e2199";

const getGaugesContract = (provider, getSigner) =>
  new ethers.Contract(
    "0xc2cd962e53afcdf574b409599a24724efbadb3d4",
    gaugeControllerAbi,
    getSigner ? provider.getSigner() : provider
  );

const getGauges = async () => {
  const provider = new ethers.providers.JsonRpcProvider(rpcURL);
  console.log(provider);
  const gaugeController = getGaugesContract(provider, false);
  const gaugesNames = ["IQ/FRAX Uniswap V2", "ETH/IQ Uniswap V2"];

  let numberOfGauges = await gaugeController.n_gauges({ gasLimit: 500000 });
  numberOfGauges = Number(numberOfGauges.toString());

  let gauges = [];
  for (let i = 0; i < numberOfGauges; i++) {
    const address = await gaugeController.gauges(i, { gasLimit: 500000 });

    let gaugeWeight = await gaugeController.get_gauge_weight(address, {
      gasLimit: 400000
    });
    // console.log(gaugeWeight.toString());
    // console.log(ethers.utils.formatEther(gaugeWeight));

    gaugeWeight = Number(ethers.utils.formatEther(gaugeWeight)).toFixed(2);

    gauges.unshift({
      address,
      name: gaugesNames[i],
      gaugeWeight
    });
  }

  return gauges;
};

const getPoints = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.JsonRpcProvider();

    const gaugeController = getGaugesContract(provider, false);

    const result = await gaugeController.points_total(UNI_GAUGE_FRAX_IQ_ADDR);

    console.log(result.toString());
  }

  return false;
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

const getDiffInDays = (date1, date2) => {
  const diffTime = Math.abs(date1 - date2);
  console.log(`DIFF TIME ${diffTime}`);
  console.log(`DIFF TIME ${new Date(diffTime)}`);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

const getLeftTimeToReVote = async (wallet, gauge_addr) => {
  console.log(gauge_addr);
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

    console.log(`POWER: ${power}`);

    return Number(power.toString());
  }
};

export {
  getGauges,
  getPoints,
  voteForGauge,
  getLeftTimeToReVote,
  getUserVotingPower
};
