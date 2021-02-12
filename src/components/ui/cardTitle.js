import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Title = styled.div`
  text-align: center;
  font-size: 70px;
`;

const CardTitle = ({ title, className, icon }) => {
  return (
    <Title>
      <span title={title} role="img" aria-label={title} className={className}>
        {icon}
      </span>
    </Title>
  );
};

CardTitle.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

export default CardTitle;
