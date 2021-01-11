import { firestore } from "./firebase.utils";

export const postTvReel = (postData) => {
  firestore
    .collection("tvReels")
    .doc(postData.tvId)
    .collection("reels")
    .doc(postData.id)
    .set(postData);
};
