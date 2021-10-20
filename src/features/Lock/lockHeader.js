import React, { memo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import * as Humanize from "humanize-plus";

const LockHeader = ({ wallet, currentHiIQ, updatingBalance, lockedIQ }) => {
  const { t } = useTranslation();

  return (
    <>
      {wallet.status === "connected" || wallet.status === "connecting" ? (
        <>
          {currentHiIQ && currentHiIQ > 0 ? (
            <div className="w-100 d-flex flex-column justify-content-between text-center">
              <div className="mx-auto d-flex flex-row align-content-center justify-content-center w-75">
                <h3 className="font-weight-bold m-0 d-flex flex-column justify-content-center text-center">
                  {updatingBalance === false ? (
                    <>
                      {Humanize.intComma(Number(currentHiIQ).toFixed(2))} hiIQ
                    </>
                  ) : (
                    <>{t("updating_balance")}</>
                  )}
                </h3>
              </div>
              <div className="mt-2">
                <span className="text-muted">{t("you_have_locked")} </span>
                <span className="monospaced">
                  {Humanize.intComma(Number(lockedIQ).toFixed(4))}
                </span>{" "}
                <span>IQ</span>
              </div>
            </div>
          ) : (
            <div className="w-75 d-flex flex-column justify-content-center">
              <strong className="text-center text-uppercase">
                {!updatingBalance && currentHiIQ === 0
                  ? t("no_hiiq_tokens_locked")
                  : t("loading")}
              </strong>
            </div>
          )}
        </>
      ) : (
        <div className="w-75 d-flex flex-column justify-content-center">
          <strong className="text-center text-uppercase">
            {t("disconnected")}
          </strong>
        </div>
      )}
    </>
  );
};

LockHeader.propTypes = {
  wallet: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  currentHiIQ: PropTypes.number.isRequired,
  updatingBalance: PropTypes.bool.isRequired,
  lockedIQ: PropTypes.string.isRequired
};

export default memo(LockHeader);
