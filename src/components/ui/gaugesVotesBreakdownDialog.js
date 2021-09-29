import React from "react";
import PropTypes from "prop-types";
import DataTable from "react-data-table-component";

import GenericDialog from "./genericDialog";

const GaugesVotesBreakdownDialog = ({ show, setShow }) => {
  const columns = [
    {
      name: "Time",
      selector: row => row.time
    },
    {
      name: "Voter",
      selector: row => row.voter
    },
    {
      name: "HiIQ",
      selector: row => row.hiiq
    },
    {
      name: "Gauge",
      selector: row => row.gauge
    },
    {
      name: "Weight",
      selector: row => row.weight
    },
    {
      name: "Total Weight",
      selector: row => row.totalWeight
    }
  ];

  const data = [
    {
      id: 1,
      time: "29-09-2021",
      voter: "0xAe65930180ef4d86dbD1844275433E9e1d6311ED",
      hiiq: "202345",
      gauge: "frax-iq",
      weight: "75%",
      totalWeight: "304567890"
    },
    {
      id: 2,
      time: "29-09-2021",
      voter: "0xAe65930180ef4d86dbD1844275433E9e1d6311ED",
      hiiq: "202345",
      gauge: "frax-iq",
      weight: "75%",
      totalWeight: "304567890"
    }
  ];

  return (
    <GenericDialog
      show={show}
      onHide={() => setShow(false)}
      size="lg"
      title="Votes breakdown"
      body={<DataTable columns={columns} data={data} pagination dense />}
    />
  );
};

GaugesVotesBreakdownDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired
};

export default GaugesVotesBreakdownDialog;
