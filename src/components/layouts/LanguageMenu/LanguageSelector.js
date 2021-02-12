import React, { useState } from "react";
import styled from "styled-components";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Nav,
  Modal,
  ModalBody,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import LanguageList from "./LanguageList";
import { resources } from "../../../utils/i18n";
import { isDesktop } from "../../../constants/index";

const NavContainer = styled.div`
  padding-right: 0.75rem;
  cursor: pointer;
`;
const LanguageMenuWrapper = styled.span`
  text-align: center;
`;
const ChevronWrapper = styled.span`
  display: inline-block;
  width: 1.5em;
`;
const ChevronDown = styled.span`
  border-style: solid;
  border-width: 0.12em 0.12em 0 0;
  content: "";
  display: inline-block;
  height: 0.65em;
  position: relative;
  top: 0.3em;
  transform: rotate(135deg);
  vertical-align: top;
  width: 0.65em;
`;

const ChevronUp = styled.span`
  border-style: solid;
  border-width: 0.12em 0.12em 0 0;
  content: "";
  display: inline-block;
  height: 0.65em;
  position: relative;
  top: 0.6em;
  transform: rotate(-45deg);
  vertical-align: top;
  width: 0.65em;
`;

const StyledNavItem = styled(Nav.Item)`
  padding: 8px 0 8px 0;
`;

const StyledBodyModal = styled(ModalBody)`
  &&& {
    padding: 0px;
  }
`;

const StyledButtonGroup = styled(ToggleButtonGroup)`
  width: 100%;
`;

const LanguageSelector = () => {
  const urlLocation = useLocation();
  const baseurl = urlLocation.pathname;
  const searchurl = urlLocation.search;
  const history = useHistory();
  const browserLang = localStorage.getItem("storeLang");

  const [toggleDropDown, setToggleDropDown] = useState(false);
  const [display, setDisplay] = useState(false);

  const [language, setLanguage] = useState(` ${browserLang.toUpperCase()}`);
  const { t, i18n } = useTranslation();

  const doesHaveLng = (params, langparam) => {
    const re = /lng=(\w+)/;
    const LangQuery = re.test(params)
      ? params.replace(re, langparam)
      : `${params}&${langparam}`;
    return LangQuery;
  };

  const handleChange = (e) => {
    if (e.target.innerText) {
      const LangFormatted = e.target.innerText.slice(1).toLowerCase();
      const NewUrlParameter = searchurl
        ? doesHaveLng(`${baseurl}${searchurl}`, `lng=${LangFormatted}`)
        : `${baseurl}?lng=${LangFormatted}`;
      history.push(NewUrlParameter);
      setLanguage(e.target.innerText);
      i18n.changeLanguage(LangFormatted);
      localStorage.setItem("storeLang", LangFormatted);
    }
  };

  const openLangList = () => {
    setToggleDropDown(!toggleDropDown);
  };

  const openLanguageModal = () => {
    setDisplay(true);
  };

  const closeLanguageModal = () => {
    setDisplay(false);
  };

  return (
    <>
      {isDesktop ? (
        <NavContainer onClick={openLangList}>
          <LanguageMenuWrapper>
            <span title="globe" role="img" aria-label="globe">
              🌎
            </span>
            {language}
            <span>&nbsp;</span>
            <ChevronWrapper>
              {toggleDropDown ? <ChevronUp /> : <ChevronDown />}
            </ChevronWrapper>
          </LanguageMenuWrapper>
          {toggleDropDown && (
            <LanguageList
              handleChange={handleChange}
              languageData={Object.keys(resources)}
            />
          )}
        </NavContainer>
      ) : (
        <>
          <StyledNavItem onClick={openLanguageModal}>
            {t("language")}
          </StyledNavItem>
          <Modal show={display} onHide={closeLanguageModal} centered>
            <Modal.Header closeButton>{t("select_a_language")}</Modal.Header>
            <StyledBodyModal>
              <StyledButtonGroup
                type="radio"
                vertical="true"
                size="lg"
                name="language-options"
                defaultValue={language}
              >
                {Object.keys(resources).map((lang) => (
                  <ToggleButton
                    value={` ${lang}`}
                    onClick={handleChange}
                    variant="light"
                    className="text-uppercase"
                    key={lang}
                  >
                    <span>&nbsp;</span>
                    {lang}
                  </ToggleButton>
                ))}
              </StyledButtonGroup>
            </StyledBodyModal>
            <Modal.Footer>
              <Button variant="primary" onClick={closeLanguageModal}>
                {t("done")}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default LanguageSelector;
