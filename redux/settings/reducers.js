import { ActionTypes } from "./types";
const INITIAL_STATE = {
  colors: {},
  chatFont: "",
  chatFontSize: 15,
  chatBackground: 2,
};

const settingsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.SET_CHAT_FONT:
      return {
        ...state,
        chatFont: action.payload,
      };
    case ActionTypes.SET_CHAT_FONT_SIZE:
      return {
        ...state,
        chatFontSize: action.payload,
      };
    case ActionTypes.SET_COLORS:
      return {
        ...state,
        colors: action.payload,
      };
    case ActionTypes.SET_CHAT_BACKGROUND:
      return {
        ...state,
        chatBackground: action.payload,
      };
    default:
      return state;
  }
};

export default settingsReducer;
