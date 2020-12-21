import { ActionTypes } from "./types";

const INITIAL_STATE = {
  loadedReels: [],
  myReels: [],
  tvReels: [],
  userReels: [],
  replyUser: "",
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
    case ActionTypes.SET_TV_REELS:
      return {
        ...state,
        tvReels: action.payload,
      };
    case ActionTypes.SET_USER_REELS:
      return {
        ...state,
        userReels: action.payload,
      };
    case ActionTypes.SET_REPLY_USER:
      return {
        ...state,
        replyUser: action.payload,
      };
    default:
      return state;
  }
};

export default reelReducer;
