import { ethers } from "ethers";
import { gaugeControllerAbi } from "./gaugeController.abi";

const getGaugesContract = (provider, getSigner) =>
  new ethers.Contract(
    "0xDC11f7E700A4c898AE5CAddB1082cFfa76512aDD",
    gaugeControllerAbi,
    getSigner ? provider.getSigner() : provider
  );

const getGauges = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://3d5d-165-227-192-32.ngrok.io"
  );

  console.log(provider);

  const gaugeController = getGaugesContract(provider, false);

  console.log("before");
  const gauges = await gaugeController.gauges(0);

  console.log("hey");
  console.log(gauges);
  console.log(ethers.utils.formatEther(gauges));
};

const voteForGauge = async (wallet, time, user, gauge_addr, weight) => {
  if (wallet.status === "connected") {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
  }
};

const getUserVotingPower = async wallet => {
  //if (wallet.status === "connected") {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://3d5d-165-227-192-32.ngrok.io"
  );

  const gaugeControllerContract = getGaugesContract(provider, false);

  const power = await gaugeControllerContract.vote_user_power(
    "0xAe65930180ef4d86dbD1844275433E9e1d6311ED",
    {
      gasLimit: 100000
    }
  );

  console.log(power);
  // }
};

export { getGauges, getUserVotingPower };
