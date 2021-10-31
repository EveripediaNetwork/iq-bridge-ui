import React, { memo, useState, lazy, useContext, useEffect } from "react";
import { useWallet } from "use-wallet";

import { GaugesContext } from "../../context/gaugesContext";
import Layout from "../../components/layouts/layout";
import {
  getGauges,
  getPoints,
  getUserVotingPower
} from "../../utils/EthDataProvider/GaugesDataProvider";

const WeightDistribution = lazy(() => import("./weightDistribution"));
const GaugesVoting = lazy(() => import("./gaugesVoting"));
const VotingHistory = lazy(() => import("./votingHistory"));

const Gauges = () => {
  const wallet = useWallet();
  const [votingPower, setVotingPower] = useState(0);

  const { setGauges } = useContext(GaugesContext);

  useEffect(() => {
    if (wallet.status === "connected") {
      (async () => {
        const gaugesResult = await getGauges();
        setGauges(gaugesResult);
        setVotingPower(await getUserVotingPower(wallet));
        await getPoints(wallet);
      })();
    }
  }, [wallet.status]);

  return (
    <Layout>
      <div className="d-flex flex-row flex-wrap justify-content-center h-75 align-items-center">
        <WeightDistribution />
        <GaugesVoting votingPower={votingPower} />
        <VotingHistory />
      </div>
    </Layout>
  );
};

export default memo(Gauges);
