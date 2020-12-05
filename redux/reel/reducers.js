import { ActionTypes } from "./types";

const INITIAL_STATE = {
  loadedReels: [],
  myReels: [],
  userReels: [],
};

const reelReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.SET_REELS:
      return {
        ...state,
        loadedReels: action.payload,
      };
    case ActionTypes.SET_MY_REELS:
      return {
        ...state,
        myReels: action.payload,
      };
    case ActionTypes.SET_USER_REELS:
      return {
        ...state,
        userReels: action.payload,
      };
    default:
      return state;
  }
};

export default reelReducer;
