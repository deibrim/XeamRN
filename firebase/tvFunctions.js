import { firestore } from "./firebase.utils";
const tvFollowersRef = firestore.collection("tvFollowers");
export const postTvReel = (postData) => {
  firestore
    .collection("tvReels")
    .doc(postData.tvId)
    .collection("reels")
    .doc(postData.id)
    .set(postData);
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
      body: `${currentUser.username} started following your tv`,
    }),
  });
  return "success";
  // .then((res) => res.json())
  // .then((data) => console.log(data));
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

export const handleDeleteTvProfile = async (tvId) => {
  firestore.collection("xeamTvs").doc(tvId).delete();
};
