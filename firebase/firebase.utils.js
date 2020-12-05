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

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

// const usersRef = firestore.collection("users").doc().set();
// const reelsRef = firestore.collection("posts");
// const commentsRef = firestore.collection("comments");
const activityFeedRef = firestore.collection("activity_feed");
const followersRef = firestore.collection("followers");
const followingRef = firestore.collection("following");
// const timelineRef = firestore.collection("timeline");

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;
  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const usersRef = firebase.database().ref("users");
  const snapShot = await userRef.get();
  const profile_pic = toonavatar.generate_avatar();
  if (!snapShot.exists) {
    const { email, uid } = userAuth;
    const joined = new Date();
    try {
      await userRef.set({
        id: uid,
        verified: false,
        verifiedProfile: false,
        email,
        joined,
        location: "",
        website: "",
        headline: "",
        gender: "",
        bio: "",
        profile_pic,
        ...additionalData,
      });
      await followersRef.doc(uid).collection("userFollowers").doc(uid).set({});
      await usersRef.child(uid).set({
        id: uid,
        profile_pic,
        ...additionalData,
      });
    } catch (error) {
      console.log("Error creating user");
    }
  }
  return userRef;
};

export const addNotification = async (notificationId, userId, notification) => {
  const userRef = firestore.doc(
    `users/${userId}/notifications/${notificationId}`
  );
  try {
    await userRef.set(notification);
  } catch (error) {}
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

export const postReel = (postData) => {
  firestore
    .collection("reels")
    .doc(postData.user_id)
    .collection("userReels")
    .doc(postData.id)
    .set(postData);
  // firestore.collection("reels").doc(postData.id).set(postData);
  // firestore.collection("data").doc("one").set(docData)
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
  // remove following
  const fgRef = followingRef
    .doc(currentUserId)
    .collection("userFollowing")
    .doc(profileId);
  const fgSnapshot = fgRef.get();

  fgSnapshot.then((doc) => {
    if (doc.exists) {
      fgRef.delete();
    }
  });
  // delete activity feed item for them
  const ayRef = activityFeedRef
    .doc(profileId)
    .collection("feedItems")
    .doc(currentUserId);
  const aySnapshot = ayRef.get();
  aySnapshot.then((doc) => {
    if (doc.exists) {
      ayRef.delete();
    }
  });
};

export const handleFollowUser = (profileId, currentUser) => {
  // Make auth user follower of THAT user (update THEIR followers collection)
  followersRef
    .doc(profileId)
    .collection("userFollowers")
    .doc(currentUser.id)
    .set({});
  // Put THAT user on YOUR following collection (update your following collection)
  followingRef
    .doc(currentUser.id)
    .collection("userFollowing")
    .doc(profileId)
    .set({});
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
};

// Note: To delete post, ownerId and currentUserId must be equal, so they can be used interchangeably
export const deleteReel = async (ownerId, postId) => {
  // delete post itself
  const rsRef = await reelsRef.doc(ownerId).collection("userReels").doc(postId);
  const reelsSnapshot = rsRef.get();
  reelsSnapshot.then((doc) => {
    if (doc.exists) {
      rsRef.delete();
    }
  });
  // delete uploaded video for the database storage
  // then delete all activity feed notifications
  const afRef = await activityFeedRef
    .doc(ownerId)
    .collection("feedItems")
    .where("postId", "==", `${postId}`);
  const activityFeedSnapshot = afRef.get();
  activityFeedSnapshot.docs.forEach((doc) => {
    if (doc.exists) {
      afRef.delete();
    }
  });
  // then delete all comments
  const csRef = await commentsRef.doc(postId).collection("comments");
  const commentsSnapshot = csRef.get();
  commentsSnapshot.docs.forEach((doc) => {
    if (doc.exists) {
      csRef.delete();
    }
  });
};

export const handleLikeReel = (currentUserId, ownerId, postId) => {
  const _isLiked = likes[currentUserId] === true;

  if (_isLiked) {
    reelsRef
      .doc(ownerId)
      .collection("userReels")
      .doc(postId)
      .update({ "likes.$currentUserId": false });
    removeLikeFromActivityFeed();
    // setState(() {
    //   likeCount -= 1;
    //   isLiked = false;
    //   likes[currentUserId] = false;
    // });
  } else if (!_isLiked) {
    reelsRef
      .doc(ownerId)
      .collection("userReels")
      .doc(postId)
      .update({ "likes.$currentUserId": true });
    addLikeToActivityFeed();
    // setState(() {
    //   likeCount += 1;
    //   isLiked = true;
    //   likes[currentUserId] = true;
    //   showHeart = true;
    // });
    // Timer(Duration(milliseconds: 500), () {
    //   setState(() {
    //     showHeart = false;
    //   });
    // });
  }
};

export const addLikeToActivityFeed = (currentUserId, ownerId, postId) => {
  // add a notification to the postOwner's activity feed only if comment made by OTHER user (to avoid getting notification for our own like)
  const isNotPostOwner = currentUserId != ownerId;
  if (isNotPostOwner) {
    activityFeedRef.doc(ownerId).collection("feedItems").doc(postId).set({
      type: "like",
      username: currentUser.username,
      userId: currentUser.id,
      userProfileImg: currentUser.photoUrl,
      postId: postId,
      mediaUrl: mediaUrl,
      timestamp: timestamp,
    });
  }
};

export const removeLikeFromActivityFeed = (currentUserId, ownerId, postId) => {
  const isNotPostOwner = currentUserId != ownerId;
  if (isNotPostOwner) {
    const ayRef = activityFeedRef
      .documents(ownerId)
      .collection("feedItems")
      .documents(postId)
      .get();
    ayRef.then((doc) => {
      if (doc.exists) {
        ayRef.delete();
      }
    });
  }
};

export default firebase;
