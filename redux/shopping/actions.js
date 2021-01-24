import { ActionTypes } from "./types";

export const setShoppingBagSize = (quantity) => ({
  type: ActionTypes.SET_BAG_SIZE,
  payload: quantity,
});
export const setCurrentOrder = (order) => ({
  type: ActionTypes.SET_CURRENT_ORDER,
  payload: order,
});
