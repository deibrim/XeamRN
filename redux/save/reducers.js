import { ActionTypes } from "./types";

const INITIAL_STATE = {
  posts: [],
  products: [],
};

const saveReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.SET_SAVE_POST:
      return {
        ...state,
        posts: action.payload,
      };
    case ActionTypes.SET_SAVE_PRODUCT:
      return {
        ...state,
        products: action.payload,
      };
    default:
      return state;
  }
};

export default saveReducer;
