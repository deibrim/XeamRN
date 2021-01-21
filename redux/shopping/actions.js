import { ActionTypes } from "./types";

export const setShoppingBagSize = (quantity) => ({
  type: ActionTypes.SET_BAG_SIZE,
  payload: quantity,
});
