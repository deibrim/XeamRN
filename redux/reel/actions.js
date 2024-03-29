import { ActionTypes } from "./types";

export const setReels = (reels) => ({
  type: ActionTypes.SET_REELS,
  payload: reels,
});
export const setMyReels = (reels) => ({
  type: ActionTypes.SET_MY_REELS,
  payload: reels,
});
export const setTvReels = (reels) => ({
  type: ActionTypes.SET_TV_REELS,
  payload: reels,
});
export const setUserReels = (reels) => ({
  type: ActionTypes.SET_USER_REELS,
  payload: reels,
});
export const setReplyUser = (username) => ({
  type: ActionTypes.SET_REPLY_USER,
  payload: username,
});
