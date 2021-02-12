const userTokensReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_TOKEN_BALANCE": {
      return {
        userTokens: action.payload,
      };
    }

    default:
      throw new Error("unexpected userTokensReducer case");
  }
};

export default userTokensReducer;
