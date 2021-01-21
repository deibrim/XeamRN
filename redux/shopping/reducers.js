import { ActionTypes } from "./types";

const INITIAL_STATE = {
  bagSize: 0,
};

const shoppingReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.SET_BAG_SIZE:
      return {
        ...state,
        bagSize: action.payload,
      };
    default:
      return state;
  }
};

export default shoppingReducer;
