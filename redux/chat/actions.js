import { ActionTypes } from "./types";

export const setCurrentChannel = (channel) => ({
  type: ActionTypes.SET_CURRENT_CHANNEL,
  payload: channel,
});
export const setFriends = (friends) => ({
  type: ActionTypes.SET_FRIENDS,
  payload: friends,
});

export const setPrivateChannel = (channel) => ({
  type: ActionTypes.SET_PRIVATE_CHANNEL,
  payload: channel,
});

export const setUserPosts = (userPosts) => {
  return {
    type: ActionTypes.SET_USER_POSTS,
    payload: userPosts,
  };
};

/* Colors Actions */
export const setColors = (primaryColor, secondaryColor) => {
  return {
    type: ActionTypes.SET_COLORS,
    payload: {
      primaryColor,
      secondaryColor,
    },
  };
};
export const setChatBackground = (imageUri) => {
  return {
    type: ActionTypes.SET_CHAT_BACKGROUND,
    payload: imageUri,
  };
};
