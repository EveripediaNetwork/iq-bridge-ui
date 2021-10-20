const round = (number, precision) => {
  // eslint-disable-next-line no-shadow
  const shift = (number, exponent) => {
    // eslint-disable-next-line prefer-template
    const numArray = ("" + number).split("e");
    return +(
      // eslint-disable-next-line prefer-template
      (numArray[0] + "e" + (numArray[1] ? +numArray[1] + exponent : exponent))
    );
  };

  return shift(Math.round(shift(number, +precision)), -precision);
};

export { round };
