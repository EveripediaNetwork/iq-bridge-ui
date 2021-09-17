const { default: GenericDialog } = require("./genericDialog");

const GaugesVotesBreakdownDialog = ({ show, setShow }) => {
  return (
    <GenericDialog
      show={show}
      onHide={() => setShow(false)}
      size="lg"
      title="Votes breakdown"
      body={
        
      }
    />
  );
};
