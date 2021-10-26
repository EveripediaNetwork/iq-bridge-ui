import { ethers } from "ethers";
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

  console.log(provider);

  const gaugeController = getGaugesContract(provider, false);

  // const gauges = await gaugeController.gauges(0, { gasLimit: 500000 });
  let numberOfGauges = await gaugeController.n_gauges({ gasLimit: 500000 });
  numberOfGauges = Number(numberOfGauges.toString());

  console.log(numberOfGauges);

  for (let i = 0; i < numberOfGauges; i++) {
    console.log(await gaugeController.gauges(i, { gasLimit: 500000 }));
  }
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

    const powerGas = await gaugeControllerContract.estimateGas.vote_user_power(
      "0xAe65930180ef4d86dbD1844275433E9e1d6311ED"
    );

    const power = await gaugeControllerContract.vote_user_power(
      "0xAe65930180ef4d86dbD1844275433E9e1d6311ED",
      {
        gasLimit: powerGas
      }
    );

    console.log(power);
  }
};

export { getGauges, getUserVotingPower };
