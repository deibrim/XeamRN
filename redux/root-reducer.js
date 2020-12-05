// import createSecureStore from "redux-persist-expo-securestore"
import { combineReducers } from "redux";
import { persistCombineReducers } from "redux-persist";
import { AsyncStorage } from "react-native";
import userReducer from "./user/reducers";
import chatReducer from "./chat/reducers";
import reelReducer from "./reel/reducers";
import settingsReducer from "./settings/reducers";

// const storage = createSecureStore();

const persistConfig = {
  key: "root",
  // storage,
  storage: AsyncStorage,
  whitelist: ["user", "setting"],
};
const rootReducer = {
  user: userReducer,
  chat: chatReducer,
  reel: reelReducer,
  setting: settingsReducer,
};

export default persistCombineReducers(persistConfig, rootReducer);
