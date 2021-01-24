import { ActionTypes } from "./types";

const INITIAL_STATE = {
  bagSize: 0,
  currentOrder: {},
};

const shoppingReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.SET_BAG_SIZE:
      return {
        ...state,
        bagSize: action.payload,
      };
    case ActionTypes.SET_CURRENT_ORDER:
      return {
        ...state,
        currentOrder: action.payload,
      };
    default:
      return state;
  }
};

export default shoppingReducer;
