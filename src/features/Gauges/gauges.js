import React, { memo, useState, lazy, useContext, useEffect } from "react";
import { useWallet } from "use-wallet";

import { GaugesContext } from "../../context/gaugesContext";
import Layout from "../../components/layouts/layout";
import {
  getGauges,
  getUserVotingPower
} from "../../utils/EthDataProvider/GaugesDataProvider";

const WeightDistribution = lazy(() => import("./weightDistribution"));
const GaugesVoting = lazy(() => import("./gaugesVoting"));
const VotingHistory = lazy(() => import("./votingHistory"));

const Gauges = () => {
  const wallet = useWallet();

  const [gauges] = useState([
    { name: "polygon-hiiq", weight: 37 },
    { name: "usdc-hiiq", weight: 33.4 },
    { name: "iq-editing-rewards", weight: 2.6 }
  ]);

  const { setGauges } = useContext(GaugesContext);

  useEffect(() => {
    if (gauges) setGauges(gauges);

    (async () => {
      await getGauges();
      // await getUserVotingPower(wallet);
    })();
  }, []);

  return (
    <Layout>
      <div className="d-flex flex-row flex-wrap justify-content-center h-75 align-items-center">
        <WeightDistribution />
        <GaugesVoting />
        <VotingHistory />
      </div>
    </Layout>
  );
};

export default memo(Gauges);
