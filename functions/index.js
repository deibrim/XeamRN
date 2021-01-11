const functions = require("firebase-functions");
const {
  createUser,
  createFollower,
  deleteFollower,
  createReel,
  updateReel,
  deleteReel,
} = require("./accountFunctions");
const {
  createTvProfile,
  createTvFollower,
  deleteTvFollower,
  createTvReel,
  updateTvReel,
  deleteTvReel,
} = require("./tvFunctions");
const {
  createXStore,
  createStoreFollower,
  deleteStoreFollower,
  createStoreReel,
  updateStoreReel,
  deleteStoreReel,
  createStoreProduct,
  updateStoreProduct,
  deleteStoreProduct,
} = require("./storeFunctions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.onCreateUser = functions.firestore
  .document("/users/{userId}")
  .onCreate(createUser);

exports.onCreateFollower = functions.firestore
  .document("/followers/{userId}/userFollowers/{followerId}")
  .onCreate(createFollower);

exports.onDeleteFollower = functions.firestore
  .document("/followers/{userId}/userFollowers/{followerId}")
  .onDelete(deleteFollower);

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

exports.onCreateTvProfile = functions.firestore
  .document("/xeamTvs/{tvId}")
  .onCreate(createTvProfile);

exports.onCreateTvFollower = functions.firestore
  .document("/tvFollowers/{tvId}/followers/{followerId}")
  .onCreate(createTvFollower);

exports.onDeleteTvFollower = functions.firestore
  .document("/tvFollowers/{tvId}/followers/{followerId}")
  .onDelete(deleteTvFollower);

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

exports.onCreateXStore = functions.firestore
  .document("/xeamStores/{storeId}")
  .onCreate(createXStore);

exports.onCreateStoreFollower = functions.firestore
  .document("/storeFollowers/{storeId}/followers/{followerId}")
  .onCreate(createStoreFollower);

exports.onDeleteStoreFollower = functions.firestore
  .document("/storeFollowers/{storeId}/followers/{followerId}")
  .onDelete(deleteStoreFollower);

// Reels

exports.onCreateStoreReel = functions.firestore
  .document("/storeReels/{storeId}/reels/{postId}")
  .onCreate(createStoreReel);

exports.onUpdateStoreReel = functions.firestore
  .document("/storeReels/{storeId}/reels/{postId}")
  .onUpdate(updateStoreReel);

exports.onDeleteStoreReel = functions.firestore
  .document("/storeReels/{storeId}/reels/{postId}")
  .onDelete(deleteStoreReel);

// Products

exports.onCreateStoreProduct = functions.firestore
  .document("/products/{storeId}/my_products/{productId}")
  .onCreate(createStoreProduct);

exports.onUpdateStoreProduct = functions.firestore
  .document("/products/{storeId}/my_products/{productId}")
  .onUpdate(updateStoreProduct);

exports.onDeleteStoreProduct = functions.firestore
  .document("/products/{storeId}/my_products/{productId}")
  .onDelete(deleteStoreProduct);
