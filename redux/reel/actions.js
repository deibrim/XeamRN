import { ActionTypes } from "./types";

export const setReels = (reels) => ({
  type: ActionTypes.SET_REELS,
  payload: reels,
});
export const setMyReels = (reels) => ({
  type: ActionTypes.SET_MY_REELS,
  payload: reels,
});
export const setUserReels = (reels) => ({
  type: ActionTypes.SET_USER_REELS,
  payload: reels,
});
