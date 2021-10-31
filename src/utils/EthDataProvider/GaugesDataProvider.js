import { ethers } from "ethers";
import { add } from "lodash-es";
import { gaugeControllerAbi } from "./gaugeController.abi";

const getGaugesContract = (provider, getSigner) =>
  new ethers.Contract(
    "0x9786f6d29e1c9129808bbd3d1abc475e8324285d",
    gaugeControllerAbi,
    getSigner ? provider.getSigner() : provider
  );

const getGauges = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://3d5d-165-227-192-32.ngrok.io"
  );

  const gaugeController = getGaugesContract(provider, false);

  const gaugesNames = ["IQ/FRAX Uniswap V2"];
  let numberOfGauges = await gaugeController.n_gauges({ gasLimit: 500000 });
  numberOfGauges = Number(numberOfGauges.toString());

  let gauges = [];

  for (let i = 0; i < numberOfGauges; i++) {
    const address = await gaugeController.gauges(i, { gasLimit: 500000 });

    let gaugeWeight = await gaugeController.get_gauge_weight(address, {
      gasLimit: 400000
    });
    console.log(gaugeWeight.toString());
    gaugeWeight = Number(gaugeWeight.toString());

    console.log(address);

    gauges.unshift({
      address,
      name: gaugesNames[i],
      gaugeWeight
    });
  }

  console.log(gauges);

  return gauges;
};

const getPoints = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://3d5d-165-227-192-32.ngrok.io"
    );

    const gaugeController = getGaugesContract(provider, false);

    const result = await gaugeController.points_total(
      "0x3d7126d1ce1F71Cb0111CF6ff683f55BA8474464"
    );

    console.log(result);
  }

  return false;
};

const voteForGauge = async (wallet, time, user, gauge_addr, weight) => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
  }
};

const getUserVotingPower = async wallet => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://3d5d-165-227-192-32.ngrok.io"
    );

    const gaugeControllerContract = getGaugesContract(provider, false);

    // const powerGas = await gaugeControllerContract.estimateGas.vote_user_power(
    //   "0xAe65930180ef4d86dbD1844275433E9e1d6311ED"
    // );

    console.log("power");

    const power = await gaugeControllerContract.vote_user_power(
      "0xAe65930180ef4d86dbD1844275433E9e1d6311ED",
      {
        gasLimit: 100000
      }
    );

    return Number(power.toString());
  }
};

export { getGauges, getPoints, getUserVotingPower };
