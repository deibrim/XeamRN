import { ActionTypes } from "./types";
const INITIAL_STATE = {
  currentChannel: null,
  friends: [],
  chatBackground: 2,
  isPrivateChannel: false,
  userPosts: null,
};

const chatReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload,
      };
    case ActionTypes.SET_FRIENDS:
      return {
        ...state,
        friends: action.payload,
      };
    case ActionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload,
      };
    case ActionTypes.SET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload,
      };
    case ActionTypes.SET_CHAT_BACKGROUND:
      return {
        ...state,
        chatBackground: action.payload,
      };
    default:
      return state;
  }
};

export default chatReducer;
