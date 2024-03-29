import { ActionTypes } from "./types";

const INITIAL_STATE = {
  hasNoty: false,
  currentUser: null,
  currentUserTvProfile: null,
  currentUserXStore: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.TOGGLE_HAS_NOTY:
      return {
        ...state,
        hasNoty: action.payload,
      };
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
    case ActionTypes.SET_CURRENT_USER_XSTORE:
      return {
        ...state,
        currentUserXStore: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
