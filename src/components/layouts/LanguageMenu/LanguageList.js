import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Container = styled.div`
  position: absolute;
`;
const LanguageUnorderedList = styled.div`
  position: relative;
  list-style-type: none;
  padding: 0.4em 0;
  background-color: #fff;
  border: 0px solid #ebeef5;
  border-radius: 4px;
  margin-top: 0.25em;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;
const LanguageItem = styled.li`
  text-transform: uppercase;
  padding: 0.2em 1em;
  border-width: 0;
  &:hover {
    background-color: #f0f1fc;
  }
`;
const PopperArrow = styled.div`
  position: absolute;
  z-index: -1;
  border-color: transparent;
  filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
  height: 0;
  width: 0;
  top: -0.75rem;
  border-top-width: 0;
  border-width: 6px;
  border-style: solid;
  border-bottom-color: #fff;
  content: " ";
  left: 1.5em;
`;

const LanguageList = ({ handleChange, languageData }) => {
  return (
    <Container>
      <LanguageUnorderedList>
        {languageData.map((lang) => (
          <LanguageItem onClick={handleChange} key={lang}>
            <span>&nbsp;</span>
            {lang}
          </LanguageItem>
        ))}
        <PopperArrow />
      </LanguageUnorderedList>
    </Container>
  );
};

LanguageList.propTypes = {
  handleChange: PropTypes.func.isRequired,
  languageData: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

export default LanguageList;
