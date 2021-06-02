import React, { memo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { BoxArrowUpRight } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";

import { ethBasedExplorerUrl, hiIQAddress } from "../../config";

const LockHeader = ({
  wallet,
  currentHiIQ,
  updatingBalance,
  loadingBalance
}) => {
  const { t } = useTranslation();

  return (
    <>
      {wallet.status === "connected" || wallet.status === "connecting" ? (
        <>
          {currentHiIQ && currentHiIQ > 0 ? (
            <div className="mx-auto d-flex flex-row align-content-center justify-content-center w-75">
              <h3 className="font-weight-normal m-0 d-flex flex-column justify-content-center text-center">
                {!updatingBalance ? (
                  <>{Number(currentHiIQ).toFixed(2)} hiIQ</>
                ) : (
                  <div className="w-75 d-flex flex-column text-center justify-content-center">
                    {t("updating_balance")}
                  </div>
                )}
              </h3>
              <Button
                className="pt-0 d-flex flex-column justify-content-center"
                variant="link"
              >
                <a
                  target="_blank"
                  href={`${ethBasedExplorerUrl}/token/${hiIQAddress}?a=${wallet.account}`}
                  rel="noopener noreferrer"
                >
                  <BoxArrowUpRight />
                </a>
              </Button>
            </div>
          ) : (
            <div className="w-75 d-flex flex-column justify-content-center">
              <strong className="text-center text-uppercase">
                {!loadingBalance && currentHiIQ === 0
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
  loadingBalance: PropTypes.bool.isRequired
};

export default memo(LockHeader);
