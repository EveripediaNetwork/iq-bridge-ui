import React, { memo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { BoxArrowUpRight } from "react-bootstrap-icons";
import { Button, Col, Row } from "react-bootstrap";

import { maticExplorerUrl } from "../../config";

const LockHeader = ({
  wallet,
  currentHiIQ,
  updatingBalance,
  loadingBalance
}) => {
  const { t } = useTranslation();

  return (
    <>
      {(wallet && wallet.account) ||
      wallet.status === "connected" ||
      wallet.status === "connecting" ? (
        <>
          {currentHiIQ && currentHiIQ > 0 ? (
            <div className="mx-auto d-flex flex-row justify-content-center align-items-center  w-75">
              <Row className="w-100 align-middle">
                <Col sm={10} md={10} className="p-0">
                  <h4 className="font-weight-light m-0 text-right">
                    {!updatingBalance ? (
                      <>
                        <strong>{Number(currentHiIQ).toFixed(2)} hiIQ</strong>{" "}
                        {t("locked")}
                      </>
                    ) : (
                      <div className="w-75 d-flex flex-column text-center justify-content-center">
                        {t("updating_balance")}
                      </div>
                    )}
                  </h4>
                </Col>
                <Col sm={2} md={2}>
                  <Button className="py-0 pl-0" variant="link">
                    <a
                      target="_blank"
                      href={`${maticExplorerUrl}address/${wallet.account}/tokens`}
                      rel="noreferrer"
                    >
                      <BoxArrowUpRight />
                    </a>
                  </Button>
                </Col>
              </Row>
            </div>
          ) : (
            <div className="w-75 d-flex flex-column justify-content-center">
              <strong className="text-center text-uppercase">
                {!loadingBalance && currentHiIQ && currentHiIQ === 0
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
  currentHiIQ: PropTypes.string.isRequired,
  updatingBalance: PropTypes.bool.isRequired,
  loadingBalance: PropTypes.bool.isRequired
};

export default memo(LockHeader);
