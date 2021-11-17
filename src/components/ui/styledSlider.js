import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const StyledSlider = props => (
  <Slider
    trackStyle={{ height: 14 }}
    railStyle={{ backgroundColor: "lightgray", height: 11 }}
    handleStyle={{
      borderColor: "black",
      height: 22,
      width: 22
    }}
    {...props}
  />
);

export default StyledSlider;
