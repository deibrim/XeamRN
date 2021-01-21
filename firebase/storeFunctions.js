import { firestore } from "./firebase.utils";
const storeFollowersRef = firestore.collection("storeFollowers");
export const postStoreReel = (postData) => {
  firestore
    .collection("storeReels")
    .doc(postData.storeId)
    .collection("reels")
    .doc(postData.id)
    .set(postData);
};

export const handleFollowStore = (storeId, currentUser, token) => {
  // Make auth user follower of THAT user (update THEIR followers collection)
  storeFollowersRef
    .doc(storeId)
    .collection("followers")
    .doc(currentUser.id)
    .set({});
  // add activity feed item for that user to notify about new follower (us)
  activityFeedRef.doc(storeId).collection("feedItems").doc(currentUser.id).set({
    type: "tvFollow",
    ownerId: storeId,
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
      body: `${currentUser.username} started following your store`,
    }),
  });
  return "success";
  // .then((res) => res.json())
  // .then((data) => console.log(data));
};

export const handleUnfollowStore = (storeId, currentUserId) => {
  // remove follower
  const fsRef = storeFollowersRef
    .doc(storeId)
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
    .doc(storeId)
    .collection("feedItems")
    .doc(currentUserId);
  const aySnapshot = ayRef.get();
  aySnapshot.then((doc) => {
    if (doc.exists) {
      ayRef.delete();
    }
  });
};

export const handleDeleteStore = async (storeId) => {
  firestore.collection("xeamStores").doc(storeId).delete();
};
