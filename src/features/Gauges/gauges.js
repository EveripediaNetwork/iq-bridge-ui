import React, { memo, useState, lazy, useContext, useEffect } from "react";
import { useWallet } from "use-wallet";

import { GaugesContext } from "../../context/gaugesContext";
import Layout from "../../components/layouts/layout";
import {
  getGauges,
  getGaugeType,
  getLeftTimeToReVote,
  getPoints,
  getUserVotingPower,
  getVoteUserSlopes
} from "../../utils/EthDataProvider/GaugesDataProvider";
import { getTokensUserBalance } from "../../utils/EthDataProvider/EthDataProvider";

const WeightDistribution = lazy(() => import("./weightDistribution"));
const GaugesVoting = lazy(() => import("./gaugesVoting"));
const VotingHistory = lazy(() => import("./votingHistory"));

const Gauges = () => {
  const wallet = useWallet();
  const [votingPower, setVotingPower] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const { setGauges, gauges, overrideAllGauges } = useContext(GaugesContext);

  useEffect(() => {
    if (wallet.status === "connected") {
      (async () => {
        const gaugesResult = await getGauges();
        setGauges(gaugesResult);
        // setVotingPower(await getUserVotingPower(wallet));
        setVotingPower(Number((await getTokensUserBalance(wallet)) * 0.01));
        await getVoteUserSlopes(wallet);
        await getGaugeType(wallet);
        // await getPoints(wallet);
      })();
    }
  }, [wallet.status]);

  useEffect(() => {
    (async () => {
      if (gauges) {
        let aux = gauges;
        for (let index = 0; index < gauges.length; index++) {
          const gaugeToUpdate = gauges[index];
          const { blockTime, nextVotingDate } = await getLeftTimeToReVote(
            wallet,
            gaugeToUpdate.address
          );
          gaugeToUpdate.blockTime = blockTime;
          gaugeToUpdate.nextVotingDate = nextVotingDate;

          aux = aux.map(g => {
            if (g.address === gaugeToUpdate.address) g = gaugeToUpdate;

            return g;
          });
        }

        overrideAllGauges(gauges);
      }
    })();
  }, [gauges]);

  return (
    <Layout>
      <div className="d-flex flex-row flex-wrap justify-content-center h-75 align-items-center">
        <WeightDistribution />
        <GaugesVoting
          updateActiveIndex={setActiveIndex}
          votingPower={votingPower}
        />
        {/* <VotingHistory /> */}
      </div>
    </Layout>
  );
};

export default memo(Gauges);
