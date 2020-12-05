import { ActionTypes } from "./types";

export const setColors = (primaryColor, secondaryColor) => {
  return {
    type: ActionTypes.SET_COLORS,
    payload: {
      primaryColor,
      secondaryColor,
    },
  };
};
export const setChatFont = (font) => {
  return {
    type: ActionTypes.SET_CHAT_FONT,
    payload: font,
  };
};
export const setChatFontSize = (fontSize) => {
  return {
    type: ActionTypes.SET_CHAT_FONT_SIZE,
    payload: fontSize,
  };
};
export const setChatBackground = (imageUri) => {
  return {
    type: ActionTypes.SET_CHAT_BACKGROUND,
    payload: imageUri,
  };
};
