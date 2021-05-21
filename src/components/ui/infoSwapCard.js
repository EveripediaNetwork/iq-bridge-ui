import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { asset } from "eos-common";

import { amountToAsset, getPriceInfo } from "../../utils/EosDataProvider";
import SlippageContext from "../../context/settingsProvider/InitialSettingsContext";
import { prediqTokensContract } from "../../config";

const SubCard = styled(Card)`
  max-width: 400px;
  z-index: -1;
  top: -22px;
  margin-top: 12px;
  .card-body {
    padding: 0.35rem !important;
  }
`;

const SwapInfo = styled.div`
  .infoLine {
    display: grid;
    grid-template-columns: 200px auto;
    justify-content: space-between;
    font-size: 14px;
    color: #aeabab;
    margin: 8px;
  }
  .warning {
    color: red;
  }
  .safe {
    color: #aeabab;
  }
`;

const InfoSwapCard = ({ control, pools, pairs, minReceived }) => {
  const { t } = useTranslation();
  const [assets, setAssets] = useState();
  const [fee, setFee] = useState();
  const [maxProfit, setMaxProfit] = useState();

  const { FromAmount, ToAmount } = useWatch(control);

  const { slippageLimit } = useContext(SlippageContext);

  useEffect(() => {
    if (!pools || pools.length === 0) {
      return; // no pools
    }
    // TODO: calculate data from pool

    if (pairs) {
      setFee(pairs.fee / 100.0);
      const assetToGive = amountToAsset(FromAmount, pairs.from.asset);
      const assetToReceive = amountToAsset(ToAmount, pairs.to.asset);
      const assetsNew = getPriceInfo(assetToGive, assetToReceive, pairs);
      setAssets(assetsNew);
      const calculatedMaxProfit = asset(
        assetToReceive.amount - assetToGive.amount,
        assetToGive.symbol
      );
      setMaxProfit(calculatedMaxProfit.to_string());
    }
  }, [pools, pairs, FromAmount, ToAmount]);

  const displayMaxProfit =
    pairs &&
    pairs.from &&
    pairs.to &&
    [pairs.from.contract, pairs.to.contract].some(
      str => str === prediqTokensContract
    );

  return (
    <SubCard className="mx-auto shadow-none">
      <Card.Body>
        <SwapInfo>
          <div className="infoLine">
            <div>{t("min_received")}</div>
            <div>{minReceived}</div>
          </div>
          {pairs &&
            pairs.from &&
            pairs.from.contract !== prediqTokensContract &&
            displayMaxProfit && (
              <div className="infoLine">
                <div>{t("max_profit")}</div>
                <div>{maxProfit}</div>
              </div>
            )}
          <div className="infoLine">
            <div>{t("price_impact")}</div>
            {assets && assets.priceImpact > slippageLimit ? (
              <span className="warning">
                {isNaN(assets?.priceImpact) ? 0 : assets?.priceImpact}%
              </span>
            ) : (
              <span className="safe">
                {isNaN(assets?.priceImpact) ? 0 : assets?.priceImpact}%
              </span>
            )}
          </div>
          <div className="infoLine">
            <div>{t("liquidity_fee")}</div>
            <div>{fee}%</div>
          </div>
        </SwapInfo>
      </Card.Body>
    </SubCard>
  );
};

InfoSwapCard.propTypes = {
  control: PropTypes.any,
  pools: PropTypes.any,
  pairs: PropTypes.any,
  minReceived: PropTypes.any
};

export default InfoSwapCard;
