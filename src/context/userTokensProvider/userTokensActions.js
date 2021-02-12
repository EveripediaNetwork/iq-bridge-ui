export const updateTokenBalance = async (user, dispatch) => {
  const accountName = await user.getAccountName();
  const userTokens = [];
  if (userTokens.length > 0) {
    dispatch({
      type: "UPDATE_TOKEN_BALANCE",
      payload: userTokens,
    });
  }
};

export const refreshTokenBalance = async (user, query, dispatch) => {
  const accountName = await user.getAccountName();
  const refreshedTokens = [];
  if (refreshedTokens.length > 0) {
    dispatch({
      type: "UPDATE_TOKEN_BALANCE",
      payload: refreshedTokens,
    });
  }
};
