import { createStore, applyMiddleware } from "redux";
import { persistStore, autoRehydrate } from "redux-persist";
import rootReducer from "./root-reducer";

import logger from "redux-logger";
const middleware = [logger];
export const store = createStore(rootReducer, autoRehydrate);

export const persistor = persistStore(store);

export default {
  store,
  persistor,
};
