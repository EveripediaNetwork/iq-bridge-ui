import { getTokens } from "../../utils/ApiDataProvider";

export const updateTokens = async (dispatch) => {
  const tokens = await getTokens();
  if (tokens.length > 0) {
    dispatch({
      type: "UPDATE_TOKENS",
      payload: tokens,
    });
  }
};
