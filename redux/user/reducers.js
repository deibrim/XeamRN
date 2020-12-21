import { ActionTypes } from "./types";

const INITIAL_STATE = {
  currentUser: null,
  currentUserTvProfile: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case ActionTypes.SET_CURRENT_USER_TV_PROFILE:
      return {
        ...state,
        currentUserTvProfile: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
