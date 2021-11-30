import React, { memo, useContext, useState, useEffect } from "react";
import { ListGroup, ListGroupItem, Spinner } from "react-bootstrap";
import { Check } from "react-bootstrap-icons";
import { useWallet } from "use-wallet";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import PropTypes from "prop-types";
import DateCountdown from "react-date-countdown-timer";

import { GaugesContext } from "../../context/gaugesContext";
import { getLeftTimeToReVote } from "../../utils/EthDataProvider/GaugesDataProvider";

const StyledListGroup = styled(ListGroup)`
  height: auto !important;
  border-radius: 5px !important;
  min-height: 175px;
  max-height: 300px !important;
  width: 100%;
  margin: auto;
  overflow-y: auto;
`;

const StyledListGroupItem = styled(ListGroupItem)`
  padding: 5px !important;
  flex-wrap: wrap;

  &.active {
    background-color: #d1e6ef !important;

    color: black !important;
  }

  .odometer-block {
    font-size: 12px !important;
    font-weight: bold;
  }
`;

const StyledCheckIcon = styled(Check)`
  color: darkgreen;
  width: 30px;
  height: 30px;
`;

const GaugesList = ({
  activeIndex,
  setActiveIndex,
  reloadNextVotingTime,
  setReloadNextVotingTime
}) => {
  const { t } = useTranslation();
  const { gauges, overrideAllGauges } = useContext(GaugesContext);
  const wallet = useWallet();
  const [loadingNextVotingTime, setLoadingNextVotingTime] = useState([]);

  const getNextVotingTime = async () => {
    if (gauges)
      setLoadingNextVotingTime(
        Array.from({ length: gauges.length }, () => true)
      );

    if (gauges && wallet.status === "connected") {
      let aux = gauges;
      const arr = [...loadingNextVotingTime];
      for (let index = 0; index < gauges.length; index += 1) {
        const gaugeToUpdate = gauges[index];
        // eslint-disable-next-line no-await-in-loop
        const { blockTime, nextVotingDate } = await getLeftTimeToReVote(
          wallet,
          gaugeToUpdate.address
        );

        gaugeToUpdate.blockTime = blockTime;
        gaugeToUpdate.nextVotingDate = nextVotingDate;

        aux = aux.map(g => {
          // eslint-disable-next-line no-param-reassign
          if (g.address === gaugeToUpdate.address) g = gaugeToUpdate;

          return g;
        });

        arr[index] = false;
      }
      setLoadingNextVotingTime(arr);

      overrideAllGauges(gauges);

      return;
    }

    if (gauges && wallet.status === "disconnected") {
      setLoadingNextVotingTime(
        Array.from({ length: gauges.length }, () => false)
      );
    }
  };

  useEffect(() => {
    getNextVotingTime();
  }, [gauges, wallet.status]);

  useEffect(() => {
    if (!reloadNextVotingTime) return;

    getNextVotingTime();
    setReloadNextVotingTime();
  }, [reloadNextVotingTime]);

  return (
    <StyledListGroup
      defaultActiveKey="link#1"
      className="d-flex flex-column justify-content-center mt-3 mb-3"
    >
      {gauges ? (
        gauges.map((g, index) => (
          <StyledListGroupItem
            key={g.name}
            onClick={() => setActiveIndex(index)}
            className={`d-flex flex-column justify-content-center monospace ${
              activeIndex === index ? "shadow-sm active" : ""
            }`}
            action
            href={`#link${index}`}
          >
            <div
              style={{ backgroundColor: "whitesmoke" }}
              className="d-flex flex-row justify-content-between"
            >
              <strong>{g.name}</strong>
              {index === activeIndex ? <StyledCheckIcon /> : null}
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center">
              <u>{t("allocated_weight")}</u>
              <span>{g.gaugeWeight || 0}</span>
            </div>

            {loadingNextVotingTime[index] === true ? (
              <div className="container h-100 d-flex flex-row justify-content-center align-items-center">
                <Spinner animation="grow" variant="warning" />
              </div>
            ) : (
              <>
                {wallet.status === "connected" && (
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <u>{t("time_to_revote")}: </u>
                    {g.nextVotingDate &&
                    g.blockTime &&
                    g.blockTime < g.nextVotingDate ? (
                      <DateCountdown
                        mostSignificantFigure="day"
                        numberOfFigures={3}
                        dateFrom={g.blockTime}
                        dateTo={g.nextVotingDate}
                        noAnimate
                      />
                    ) : (
                      <span>{t("you_can_vote_now")}</span>
                    )}
                  </div>
                )}
              </>
            )}
          </StyledListGroupItem>
        ))
      ) : (
        <div className="container h-100 d-flex flex-column justify-content-center align-items-center">
          <Spinner animation="grow" variant="primary" />
        </div>
      )}
    </StyledListGroup>
  );
};

GaugesList.defaultProps = {
  reloadNextVotingTime: undefined
};

GaugesList.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  setActiveIndex: PropTypes.func.isRequired,
  reloadNextVotingTime: PropTypes.bool,
  setReloadNextVotingTime: PropTypes.func.isRequired
};

export default memo(GaugesList);
