const functions = require("firebase-functions");
const {
  createFollower,
  deleteFollower,
  createReel,
  updateReel,
  deleteReel,
} = require("./accountFunctions");
const {
  createTvFollower,
  deleteTvFollower,
  createTvReel,
  updateTvReel,
  deleteTvReel,
} = require("./tvFunctions");
const {
  createStoreFollower,
  deleteStoreFollower,
  createStoreReel,
  updateStoreReel,
  deleteStoreReel,
  createStoreProduct,
  updateStoreProduct,
  deleteStoreProduct,
} = require("./tvFunctions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.onCreateFollower = functions.firestore
  .document("/followers/{userId}/userFollowers/{followerId}")
  .onCreate(createFollower);

exports.onDeleteFollower = functions.firestore
  .document("/followers/{userId}/userFollowers/{followerId}")
  .onDelete(deleteFollower);

// when a post is created, add post to timeline of each follower (of post owner)
exports.onCreateReel = functions.firestore
  .document("/reels/{userId}/userReels/{postId}")
  .onCreate(createReel);

exports.onUpdateReel = functions.firestore
  .document("/reels/{userId}/userReels/{postId}")
  .onUpdate(updateReel);

exports.onDeleteReel = functions.firestore
  .document("/reels/{userId}/userReels/{postId}")
  .onDelete(deleteReel);

// ****************************** TV ***************************

exports.onCreateTvFollower = functions.firestore
  .document("/tvFollowers/{tvId}/followers/{followerId}")
  .onCreate(createTvFollower);

exports.onDeleteTvFollower = functions.firestore
  .document("/tvFollowers/{tvId}/followers/{followerId}")
  .onDelete(deleteTvFollower);

// when a post is created, add post to timeline of each follower (of post owner)
exports.onCreateTvReel = functions.firestore
  .document("/tvReels/{tvId}/reels/{postId}")
  .onCreate(createTvReel);

exports.onUpdateTvReel = functions.firestore
  .document("/tvReels/{tvId}/reels/{postId}")
  .onUpdate(updateTvReel);

exports.onDeleteTvReel = functions.firestore
  .document("/tvReels/{tvId}/reels/{postId}")
  .onDelete(deleteTvReel);

// ****************************** XS ***************************

exports.onCreateStoreFollower = functions.firestore
  .document("/storeFollowers/{storeId}/followers/{followerId}")
  .onCreate(createStoreFollower);

exports.onDeleteStoreFollower = functions.firestore
  .document("/storeFollowers/{storeId}/followers/{followerId}")
  .onDelete(deleteStoreFollower);

// when a post is created, add post to timeline of each follower (of post owner)
exports.onCreateStoreReel = functions.firestore
  .document("/storeReels/{storeId}/reels/{postId}")
  .onCreate(createStoreReel);

exports.onUpdateStoreReel = functions.firestore
  .document("/storeReels/{storeId}/reels/{postId}")
  .onUpdate(updateStoreReel);

exports.onDeleteStoreReel = functions.firestore
  .document("/storeReels/{storeId}/reels/{postId}")
  .onDelete(deleteStoreReel);

exports.onCreateStoreProduct = functions.firestore
  .document("/products/{storeId}/my_products/{postId}")
  .onCreate(createStoreProduct);

exports.onUpdateStoreProduct = functions.firestore
  .document("/products/{storeId}/my_products/{postId}")
  .onUpdate(updateStoreProduct);

exports.onDeleteStoreProduct = functions.firestore
  .document("/products/{storeId}/my_products/{postId}")
  .onDelete(deleteStoreProduct);
