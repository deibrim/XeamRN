import { ActionTypes } from "./types";

export const setSavePost = (post) => ({
  type: ActionTypes.SET_SAVE_POST,
  payload: post,
});
export const setSaveProduct = (product) => ({
  type: ActionTypes.SET_SAVE_PRODUCT,
  payload: product,
});
