import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { useWallet } from "use-wallet";
import { CashStack } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as Humanize from "humanize-plus";

import GenericDialog from "../../../components/ui/genericDialog";
import {
  getEarned,
  getReward
} from "../../../utils/EthDataProvider/GaugesDataProvider";
import { GaugesContext } from "../../../context/gaugesContext";

const LockedStagesListContainer = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  height: 400px;
`;

const StyledCard = styled(Card)`
  min-height: 120px;
  width: 230px;
  max-width: 230px;
`;

const LockedStakesList = ({ lockedStakes, show, setShow, gaugeIdx }) => {
  const { gauges } = useContext(GaugesContext);
  const { t } = useTranslation();
  const [rewardsAmount, setRewardsAmount] = useState();
  const [loadingClaim, setLoadingClaim] = useState(false);
  const wallet = useWallet();

  const handleClaim = async () => {
    setLoadingClaim(true);
    await getReward(wallet, gauges[gaugeIdx].address);
    setLoadingClaim(false);
  };

  useEffect(() => {
    if (gaugeIdx)
      (async () => {
        const result = await getEarned(wallet, gauges[gaugeIdx].address);
        setRewardsAmount(Number(result));
      })();
  }, [gaugeIdx]);

  return (
    <GenericDialog
      size="lg"
      title={`${lockedStakes.gaugeName}`}
      show={show}
      onHide={() => setShow(false)}
      body={
        <LockedStagesListContainer className="w-100 d-flex flex-row flex-wrap justify-content-center align-items-center">
          <div className="d-flex w-100 p-3 flex-wrap flex-row justify-content-center align-items-center">
            <h5 className="m-0">
              {t("rewards")}: {Humanize.intComma(rewardsAmount) || 0} IQ
            </h5>
            <Button
              disabled={rewardsAmount === 0}
              onClick={handleClaim}
              variant="outline-success"
              size="sm"
              className="ml-3 d-flex flex-row justify-content-center align-items-center"
            >
              {loadingClaim ? (
                <>
                  <Spinner animation="grow" className="mr-2" />{" "}
                  <span>{t("claiming")}</span>
                </>
              ) : (
                <>
                  <span>{t("claim")}</span>
                  <CashStack style={{ fontSize: 20 }} className="ml-2" />
                </>
              )}
            </Button>
          </div>
          <hr />
          {lockedStakes.stakes.map((l, index) => (
            <StyledCard key={index} className="shadow-sm w-100 m-1 p-0">
              <Card.Body className="d-flex p-1 flex-column justify-content-center align-items-center">
                <strong className="monospace">
                  <u>{t("liquidity")}</u>
                </strong>
                <span className="monospace">{l.liquidity.toString()}</span>
                <strong className="monospace">
                  <u>{t("staked_on")}</u>
                </strong>
                <span className="monospace">
                  {new Date(
                    Number(l.start_timestamp.toString()) * 1000
                  ).toDateString()}
                </span>
                <strong className="monospace">
                  <u>{t("stake_ending_on")}</u>
                </strong>
                <span className="monospace">
                  {new Date(
                    Number(l.ending_timestamp.toString()) * 1000
                  ).toDateString()}
                </span>
                <strong className="monospace">
                  <u>{t("remaining_days")}</u>
                </strong>
                <span className="monospace">
                  {(new Date(l.ending_timestamp * 1000).getTime() -
                    new Date(l.start_timestamp * 1000).getTime()) /
                    (1000 * 3600 * 24)}
                </span>
              </Card.Body>
            </StyledCard>
          ))}
        </LockedStagesListContainer>
      }
    />
  );
};

LockedStakesList.propTypes = {
  lockedStakes: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  gaugeIdx: PropTypes.number.isRequired
};

export default LockedStakesList;
