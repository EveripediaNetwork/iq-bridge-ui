import React, { memo, lazy, useContext, useEffect } from "react";

import { GaugesContext } from "../../context/gaugesContext";
import Layout from "../../components/layouts/layout";
import { getGauges } from "../../utils/EthDataProvider/GaugesDataProvider";

const WeightDistribution = lazy(() => import("./weightDistribution"));
const GaugesVoting = lazy(() => import("./gaugesVoting"));
const LPLock = lazy(() => import("./LPLock/lpLock"));

const Gauges = () => {
  const { setGauges } = useContext(GaugesContext);

  useEffect(() => {
    (async () => {
      const gaugesResult = await getGauges();
      setGauges(gaugesResult);
    })();
  }, []);

  return (
    <Layout>
      <div className="d-flex flex-row flex-wrap justify-content-center h-75 align-items-center">
        <WeightDistribution />
        <GaugesVoting />
        <LPLock />
      </div>
    </Layout>
  );
};

export default memo(Gauges);
