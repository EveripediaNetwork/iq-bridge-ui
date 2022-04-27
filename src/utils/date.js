export const getGMTDate = value => {
  let date = value ? new Date(value) : new Date();
  date = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  return date;
};
