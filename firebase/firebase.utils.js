import toonavatar from "cartoon-avatar";
import firebase from "firebase";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBn4ZfO2hjiVTf4xg18dzWHwtIQYaDtKn8",
  authDomain: "chattie-3eb7b.firebaseapp.com",
  databaseURL: "https://chattie-3eb7b.firebaseio.com",
  projectId: "chattie-3eb7b",
  storageBucket: "chattie-3eb7b.appspot.com",
  messagingSenderId: "241163609783",
  appId: "1:241163609783:web:b17eee746948b9f6e24f32",
  measurementId: "G-CYEEQR3P3H",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

// const usersRef = firestore.collection("users").doc().set();
// const reelsRef = firestore.collection("posts");
// const commentsRef = firestore.collection("comments");
const activityFeedRef = firestore.collection("activity_feed");
const followersRef = firestore.collection("followers");
const tvFollowersRef = firestore.collection("tvFollowers");
const followingRef = firestore.collection("following");
// const timelineRef = firestore.collection("timeline");

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;
  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const usersRef = firebase.database().ref("users");
  const snapShot = await userRef.get();
  const profile_pic = toonavatar.generate_avatar();
  if (!snapShot.exists) {
    const { email, emailVerified, phoneNumber, uid } = userAuth;
    const joined = new Date();
    const data = {
      id: uid,
      verifiedProfile: false,
      email,
      emailVerified,
      phoneNumber,
      joined,
      isBusinessAccount: false,
      isTvActivated: false,
      location: "",
      website: "",
      headline: "",
      gender: "",
      bio: "",
      profile_pic,
      ...additionalData,
    };
    try {
      await userRef.set(data);
      await usersRef.child(uid).set({
        id: uid,
        profile_pic,
        ...additionalData,
      });
      auth.currentUser.sendEmailVerification();
    } catch (error) {
      auth.currentUser.delete();
      // auth.signOut();
      console.log("Error creating user profile");
    }
  }
  return userRef;
};

export const updateProfileData = async (userId, incomingData) => {
  const userRef = firestore.doc(`users/${userId}`);
  const usersRef = firebase.database().ref("users");
  const snapShot = await userRef.get();
  if (snapShot.exists) {
    try {
      await userRef.update(incomingData);
      await usersRef.child(userId).update({
        profile_pic: incomingData.profile_pic,
        username: incomingData.username,
        name: incomingData.name,
      });
      return true;
    } catch (error) {
      console.log("error updating profile", error.message);
    }
  }
};

export const DeleteProfile = async (userId) => {
  auth.currentUser
    .delete()
    .then(function () {
      firestore.collection("users").doc(userId).delete();
    })
    .catch(function (error) {
      // An error happened.
    });
};

export const addNotification = async (notificationId, userId, notification) => {
  const userRef = firestore.doc(
    `users/${userId}/notifications/${notificationId}`
  );
  try {
    await userRef.set(notification);
  } catch (error) {}
};

export const postReel = (postData) => {
  firestore
    .collection("reels")
    .doc(postData.user_id)
    .collection("userReels")
    .doc(postData.id)
    .set(postData);
};
export const set24HoursTimer = async (storyId, userId, accountType) => {
  const timestamp = Date.now();
  // const endTime = new Date(timestamp + 60 * 60 * 24 * 1000)
  const endTime = new Date(timestamp + 60 * 1000);
  try {
    const url =
      "https://us-central1-chattie-3eb7b.cloudfunctions.net/api/v1/stories/create";
    // const url = "http://192.168.43.199:5000/stories";
    const postRes = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        storyId,
        userId,
        timestamp,
        endTime,
        accountType,
      }),
    });
    const res = await postRes.json();
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};
export const postUserStory = async (postContainer, postData, postingTo) => {
  const userId = postContainer.userId;
  const storiesRefGet = await firestore
    .collection("userStories")
    .doc(userId)
    .get();
  if (storiesRefGet.exists) {
    const action = {
      type: "ADD_STORY",
      payload: postData.id,
      userId: userId,
    };
    const oldStories = storiesRefGet.data().stories;
    const newPostData = {
      stories: [...oldStories, postData],
      updatedAt: postContainer.updatedAt,
      action,
    };
    await firestore.collection("userStories").doc(userId).update(newPostData);
  } else {
    await firestore.collection("userStories").doc(userId).set(postContainer);
  }
};

export const updateViews = async (data, userId, postId) => {
  const storiesRefGet = await firestore
    .collection("userStories")
    .doc(userId)
    .get();
  const filtered = storiesRefGet
    .data()
    .stories.filter((item, index) => item.id !== postId);
  const action = {
    type: "UPDATE_VIEWS",
    payload: postId,
    userId,
  };
  const postData = {
    stories: [...filtered, data.stories],
    action,
  };
  firestore.collection("userStories").doc(userId).update(postData);
};
export const deleteUserStory = async (userId, postId) => {
  const storiesRefGet = await firestore
    .collection("userStories")
    .doc(userId)
    .get();
  if (storiesRefGet.exists) {
    const filtered = storiesRefGet
      .data()
      .stories.filter((item, index) => item.id !== postId);
    const action = {
      type: "DELETE",
      payload: postId,
      userId,
    };
    const postData = {
      stories: filtered,
      action,
    };
    firestore.collection("userStories").doc(userId).update(postData);
  }
};

export const handleUnfollowUser = (profileId, currentUserId) => {
  // remove follower
  const fsRef = followersRef
    .doc(profileId)
    .collection("userFollowers")
    .doc(currentUserId);
  const fsSnapshot = fsRef.get();

  fsSnapshot.then((doc) => {
    if (doc.exists) {
      fsRef.delete();
    }
  });

  // delete activity feed item for them
  // const ayRef = activityFeedRef
  //   .doc(profileId)
  //   .collection("feedItems")
  //   .doc(currentUserId);
  // const aySnapshot = ayRef.get();
  // aySnapshot.then((doc) => {
  //   if (doc.exists) {
  //     ayRef.delete();
  //   }
  // });
};
export const handleUnfollowTv = (tvId, currentUserId) => {
  // remove follower
  const fsRef = tvFollowersRef
    .doc(tvId)
    .collection("followers")
    .doc(currentUserId);
  const fsSnapshot = fsRef.get();

  fsSnapshot.then((doc) => {
    if (doc.exists) {
      fsRef.delete();
    }
  });

  // delete activity feed item for them
  const ayRef = activityFeedRef
    .doc(tvId)
    .collection("feedItems")
    .doc(currentUserId);
  const aySnapshot = ayRef.get();
  aySnapshot.then((doc) => {
    if (doc.exists) {
      ayRef.delete();
    }
  });
};

export const handleFollowUser = (profileId, currentUser, token) => {
  // Make auth user follower of THAT user (update THEIR followers collection)
  followersRef
    .doc(profileId)
    .collection("userFollowers")
    .doc(currentUser.id)
    .set({});
  // Put THAT user on YOUR following collection (update your following collection)
  // followingRef
  //   .doc(currentUser.id)
  //   .collection("userFollowing")
  //   .doc(profileId)
  //   .set({});
  // add activity feed item for that user to notify about new follower (us)
  activityFeedRef
    .doc(profileId)
    .collection("feedItems")
    .doc(currentUser.id)
    .set({
      type: "follow",
      ownerId: profileId,
      username: currentUser.username,
      userId: currentUser.id,
      userProfileImg: currentUser.profile_pic,
      timestamp: Date.now(),
    });
  fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channelId: "ActivitiesScreen",
      to: token,
      sound: "default",
      title: "Xeam",
      body: `${currentUser.username} started following you`,
    }),
  });
  // .then((res) => res.json())
  // .then((data) => console.log(data));
};
export const handleFollowTv = (tvId, currentUser, token) => {
  // Make auth user follower of THAT user (update THEIR followers collection)
  tvFollowersRef.doc(tvId).collection("followers").doc(currentUser.id).set({});
  // add activity feed item for that user to notify about new follower (us)
  activityFeedRef.doc(tvId).collection("feedItems").doc(currentUser.id).set({
    type: "tvFollow",
    ownerId: tvId,
    username: currentUser.username,
    userId: currentUser.id,
    userProfileImg: currentUser.profile_pic,
    timestamp: Date.now(),
  });
  fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channelId: "ActivitiesScreen",
      to: token,
      sound: "default",
      title: "Xeam",
      body: `${currentUser.username} started following your tv`,
    }),
  });
  // .then((res) => res.json())
  // .then((data) => console.log(data));
};

export const addAComment = async (
  currentUser,
  data,
  postId,
  ownerId,
  isNotPostOwner
) => {
  const commentRef = await firestore
    .collection("comments")
    .doc(postId)
    .collection("comments")
    .doc(`${data.id}`);
  commentRef.set(data);
  addToActivityFeed(
    currentUser,
    ownerId,
    postId,
    isNotPostOwner,
    "comment",
    `${currentUser.username} commented on your reel`
  );
};

export const addAReply = async ({ data, commentId, postId }) => {
  const commentRef = await firestore
    .collection("comments")
    .doc(postId)
    .collection("comments")
    .doc(`${commentId}`);
  const snapShot = await commentRef.get();
  if (snapShot.exists) {
    let replies = [];
    replies = snapShot.data().replies;
    replies.push(data);
    try {
      await commentRef.update({
        replies,
      });
      addToActivityFeed(
        currentUser,
        ownerId,
        postId,
        isNotPostOwner,
        videoUri,
        "comment",
        `${currentUser.username} reply to your reel`
      );
    } catch (error) {
      console.log("error updating profile", error.message);
    }
  }
};

// Note: To delete post, ownerId and currentUserId must be equal, so they can be used interchangeably
export const deleteReel = async (ownerId, postId) => {
  // delete post itself
  const rsRef = await firestore
    .collection("reels")
    .doc(ownerId)
    .collection("userReels")
    .doc(postId);
  const reelsSnapshot = rsRef.get();
  reelsSnapshot.then((doc) => {
    if (doc.exists) {
      rsRef.delete();
    }
  });
  // // delete uploaded video for the database storage
  // firebase.storage().ref(`reels/${postId}`).delete();
  // // then delete all activity feed notifications
  // const afRef = await activityFeedRef
  //   .doc(ownerId)
  //   .collection("feedItems")
  //   .where("postId", "==", `${postId}`);
  // const activityFeedSnapshot = await afRef.get();

  // activityFeedSnapshot.docs.forEach((doc) => {
  //   if (doc.exists) {
  //     doc.ref.delete();
  //   }
  // });
  // // then delete all comments
  // const csRef = await firestore
  //   .collection("comments")
  //   .doc(postId)
  //   .collection("comments");
  // const commentsSnapshot = await csRef.get();
  // commentsSnapshot.docs.forEach((doc) => {
  //   if (doc.exists) {
  //     doc.ref.delete();
  //   }
  // });
};
export const handleTurnPostNotificationOn = async (userId, currentUserId) => {
  firestore
    .collection("postNotifications")
    .doc(userId)
    .collection("users")
    .doc(currentUserId)
    .set({});
};
export const handleTurnPostNotificationOff = async (userId, currentUserId) => {
  firestore
    .collection("postNotifications")
    .doc(userId)
    .collection("users")
    .doc(currentUserId)
    .delete({});
};
export const addLikeToActivityFeed = async (
  currentUser,
  ownerId,
  postId,
  isNotPostOwner,
  videoUri
) => {
  // add a notification to the postOwner's activity feed only if comment made by OTHER user (to avoid getting notification for our own like)
  if (isNotPostOwner) {
    const ownerRef = firestore.collection("users").doc(ownerId);
    const ownerSnapShot = await ownerRef.get();
    activityFeedRef.doc(ownerId).collection("feedItems").doc(postId).set({
      type: "like",
      username: currentUser.username,
      userId: currentUser.id,
      userProfileImg: currentUser.profile_pic,
      postId: postId,
      videoUri,
      timestamp: Date.now(),
      viewed: false,
    });
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channelId: "ActivitiesScreen",
        to: ownerSnapShot.data().push_token.data,
        sound: "default",
        title: "Xeam",
        body: `${currentUser.username} like your reel`,
      }),
    });
  }
};

export const removeLikeFromActivityFeed = async (
  currentUser,
  postId,
  isNotPostOwner
) => {
  if (isNotPostOwner) {
    const ayRef = activityFeedRef
      .doc(currentUser.id)
      .collection("feedItems")
      .doc(postId);
    const aySnapshot = ayRef.get();
    aySnapshot.then((doc) => {
      if (doc.exists) {
        ayRef.delete();
      }
    });
  }
};
export default firebase;

async function addToActivityFeed(
  currentUser,
  ownerId,
  postId,
  isNotPostOwner,
  type,
  body
) {
  // add a notification to the postOwner's activity feed only if comment made by OTHER user (to avoid getting notification for our own like)
  if (!isNotPostOwner) {
    const ownerRef = firestore.collection("users").doc(ownerId);
    const ownerSnapShot = await ownerRef.get();
    activityFeedRef
      .doc(ownerId)
      .collection("feedItems")
      .doc(currentUser.id)
      .set({
        type,
        username: currentUser.username,
        userId: currentUser.id,
        userProfileImg: currentUser.profile_pic,
        postId,
        timestamp: Date.now(),
        viewed: false,
      });
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channelId: "ActivitiesScreen",
        to: ownerSnapShot.data().push_token.data,
        sound: "default",
        title: "Xeam",
        body,
      }),
    });
  }
}
