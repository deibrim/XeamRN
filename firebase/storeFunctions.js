import { firestore } from "./firebase.utils";

export const postStoreReel = (postData) => {
  firestore
    .collection("storeReels")
    .doc(postData.storeId)
    .collection("reels")
    .doc(postData.id)
    .set(postData);
};
