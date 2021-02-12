const tokensReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_TOKENS": {
      return {
        tokens: action.payload,
      };
    }
    case "SELECT_TOKEN": {
      return {
        tokens: state.tokens.map((item) => {
          if (item.name !== action.payload || item.isSelected) {
            return item;
          }

          return {
            ...item,
            isSelected: true,
          };
        }),
      };
    }
    case "UNSELECT_TOKEN": {
      return {
        tokens: state.tokens.map((item) => {
          if (item.name !== action.payload || !item.isSelected) {
            return item;
          }

          return {
            ...item,
            isSelected: false,
          };
        }),
      };
    }

    case "CLEAN_SELECTED_TOKEN": {
      return {
        tokens: state.tokens.map((item) => {
          return {
            ...item,
            isSelected: false,
          };
        }),
      };
    }

    default:
      throw new Error("unexpected TokensReducer case");
  }
};

export default tokensReducer;
