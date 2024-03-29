import { firestore } from "./firebase.utils";
// Refs
const storeFollowersRef = firestore.collection("storeFollowers");
const activityFeedRef = firestore.collection("activity_feed");
const shoppingAtivityFeedRef = firestore.collection("shoppingActivityFeed");
const sellerOrderRef = firestore.collection("sellerOrders");

// Functions
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
    type: "storeFollow",
    ownerId: storeId,
    username: currentUser.username,
    userId: currentUser.id,
    userProfileImg: currentUser.profile_pic,
    viewed: false,
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
export const handlePlaceOrder = async (storeId, orderId, data, token) => {
  await sellerOrderRef.doc(storeId).collection("orders").doc(orderId).set(data);

  activityFeedRef.doc(storeId).collection("feedItems").doc(currentUser.id).set({
    type: "order",
    ownerId: storeId,
    username: currentUser.username,
    userId: currentUser.id,
    userProfileImg: currentUser.profile_pic,
    orderId,
    viewed: false,
    timestamp: Date.now(),
  });
  const userRef = firestore.doc(`users/${storeId}`);
  const userSnapShot = await userRef.get();
  if (userSnapShot.exists) {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channelId: "ActivitiesScreen",
        to: userSnapShot.data().push_token.data,
        sound: "default",
        title: "Xeam",
        body: `New order placed by ${currentUser.username}`,
      }),
    });
  }
};
