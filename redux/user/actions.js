import { ActionTypes } from "./types";

export const setCurrentUser = (user) => ({
  type: ActionTypes.SET_CURRENT_USER,
  payload: user,
});
export const setCurrentUserTvProfile = (profile) => ({
  type: ActionTypes.SET_CURRENT_USER_TV_PROFILE,
  payload: profile,
});
