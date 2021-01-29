const admin = require("firebase-admin");

exports.createUser = async (snapshot, context) => {
  const userId = context.params.userId;
  await admin
    .firestore()
    .collection("followers")
    .doc(userId)
    .collection("userFollowers")
    .doc(userId)
    .set({});
};
exports.deleteUser = async (snapshot, context) => {
  const userId = context.params.userId;
  // Refs
  // Posts
  const reelsCollectionRef = admin
    .firestore()
    .collection("reels")
    .doc(userId)
    .collection("userReels");
  // const tvReelsCollectionRef = admin
  //   .firestore()
  //   .collection("tvReels")
  //   .doc(userId)
  //   .collection("reels");
  // const storeReelsCollectionRef = admin
  //   .firestore()
  //   .collection("storeReels")
  //   .doc(userId)
  //   .collection("reels");
  // // Products
  // const storeProductsCollectionRef = admin
  //   .firestore()
  //   .collection("products")
  //   .doc(userId)
  //   .collection("my_products");
  // Followers
  const followersRef = admin
    .firestore()
    .collection("followers")
    .doc(userId)
    .collection("userFollowers");
  const followingsRef = admin
    .firestore()
    .collection("following")
    .doc(userId)
    .collection("userFollowing");
  // const tvFollowersRef = admin
  //   .firestore()
  //   .collection("tvFollowers")
  //   .doc(userId)
  //   .collection("followers");
  // const storeFollowersRef = admin
  //   .firestore()
  //   .collection("storeFollowers")
  //   .doc(userId)
  //   .collection("followers");
  // Profiles
  const tvRef = admin.firestore().collection("xeamTvs").doc(userId);
  const storeRef = admin.firestore().collection("xeamStores").doc(userId);

  // followersRef.doc(userId).delete()

  // Delete Tv
  const tvSnapshot = await tvRef.get();
  tvSnapshot.exists && tvRef.delete();

  // Delete Store
  const storeSnapshot = await storeRef.get();
  storeSnapshot.exists && storeRef.delete();

  // Deleting Posts
  const reelsSnapshot = await reelsCollectionRef.get();
  if (reelsSnapshot.size > 0) {
    reelsSnapshot.forEach((doc) => {
      doc.ref.delete();
    });
  }
  // const tvReelsSnapshot = await tvReelsCollectionRef.get();
  // if (tvReelsSnapshot.size > 0) {
  //   tvReelsSnapshot.forEach((doc) => {
  //     doc.ref.delete();
  //   });
  // }
  // const storeReelsSnapshot = await storeReelsCollectionRef.get();
  // if (storeReelsSnapshot.size > 0) {
  //   storeReelsSnapshot.forEach((doc) => {
  //     doc.ref.delete();
  //   });
  // }

  // Deleting Products
  // const storeProductsSnapshot = await storeProductsCollectionRef.get();
  // if (storeProductsSnapshot.size > 0) {
  //   storeProductsSnapshot.forEach((doc) => {
  //     doc.ref.delete();
  //   });
  // }

  // Deleting Followers

  // Delete from all followers
  const followersSnapshot = await followersRef.get();
  if (followersSnapshot.size > 0) {
    followersSnapshot.forEach((doc) => {
      doc.ref.delete();
    });
  }
  const followingSnapshot = await followingsRef.get();
  if (followingSnapshot.size > 0) {
    followingSnapshot.forEach((doc) => {
      doc.ref.delete();
    });
  }
  // Delete from all Tv followers
  // const tvFollowersSnapshot = await tvFollowersRef.get();
  // if (tvFollowersSnapshot.size > 0) {
  //   tvFollowersSnapshot.forEach((doc) => {
  //     doc.ref.delete();
  //   });
  // }
  // Delete from all Store followers
  //   const storeFollowersSnapshot = await storeFollowersRef.get();
  //   if (storeFollowersSnapshot.size > 0) {
  //     storeFollowersSnapshot.forEach((doc) => {
  //       doc.ref.delete();
  //     });
  //   }
  // delete uploaded lolo for the database storage
  admin
    .storage()
    .bucket("chattie-3eb7b.appspot.com/")
    .file(`users/${userId}/profile-pic`)
    .delete();
};

exports.createFollower = async (snapshot, context) => {
  const userId = context.params.userId;
  const followerId = context.params.followerId;
  admin
    .firestore()
    .collection("following")
    .doc(followerId)
    .collection("userFollowing")
    .doc(userId)
    .set({});
  // 1) Create followed users reels ref
  const followedUserReelsRef = admin
    .firestore()
    .collection("reels")
    .doc(userId)
    .collection("userReels");

  // 2) Create following user's timeline ref
  const timelineReelsRef = admin
    .firestore()
    .collection("timeline")
    .doc(followerId)
    .collection("timelineReels");

  // 3) Get followed users reels
  const querySnapshot = await followedUserReelsRef.get();

  // 4) Add each user post to following user's timeline
  querySnapshot.forEach((doc) => {
    if (doc.exists) {
      const postId = doc.id;
      const postData = doc.data();
      timelineReelsRef.doc(postId).set(postData);
    }
  });
};

exports.deleteFollower = async (snapshot, context) => {
  const userId = context.params.userId;
  const followerId = context.params.followerId;

  const fgRef = admin
    .firestore()
    .collection("following")
    .doc(followerId)
    .collection("userFollowing")
    .doc(userId);
  const fgSnapshot = fgRef.get();

  fgSnapshot
    .then((doc) => {
      if (doc.exists) {
        fgRef.delete();
      }
      return;
    })
    .catch((err) => console.log(err));

  const timelinePostsRef = admin
    .firestore()
    .collection("timeline")
    .doc(followerId)
    .collection("timelineReels")
    .where("user_id", "==", userId);

  const querySnapshot = await timelinePostsRef.get();
  querySnapshot.forEach((doc) => {
    if (doc.exists) {
      doc.ref.delete();
    }
  });
  const ayRef = admin
    .firestore()
    .collection("activity_feed")
    .doc(followerId)
    .collection("feedItems")
    .doc(userId);
  const aySnapshot = ayRef.get();

  aySnapshot
    .then((doc) => {
      if (doc.exists) {
        ayRef.delete();
      }
      return;
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.createStory = async (snapshot, context) => {
  const postCreated = snapshot.data();
  const userId = context.params.userId;

  // 1) Get all the followers of the user who made the post
  const userFollowersRef = admin
    .firestore()
    .collection("followers")
    .doc(userId)
    .collection("userFollowers");

  const querySnapshot = await userFollowersRef.get();
  // 2) Add new post to each follower's timeline
  querySnapshot.forEach((doc) => {
    const followerId = doc.id;
    admin
      .firestore()
      .collection("stories")
      .doc(followerId)
      .collection("stories")
      .doc(userId)
      .set(postCreated);
  });
};

exports.updateStory = async (change, context) => {
  const postUpdated = change.after.data();
  const action = change.after.data().action;
  const userId = context.params.userId;

  // 1) Get all the followers of the user who made the post
  const userFollowersRef = admin
    .firestore()
    .collection("followers")
    .doc(userId)
    .collection("userFollowers");

  const querySnapshot = await userFollowersRef.get();

  // 2) Update each post in each follower's timeline
  querySnapshot.forEach(async (doc) => {
    const followerId = doc.id;
    const storiesRefGet = await admin
      .firestore()
      .collection("stories")
      .doc(followerId)
      .collection("stories")
      .doc(userId)
      .get();
    if (storiesRefGet.exists) {
      if (postUpdated.stories.length === 0) {
        storiesRefGet.ref.delete();
      } else {
        storiesRefGet.ref.update({
          stories: postUpdated.stories,
          updatedAt: postUpdated.updatedAt,
        });
      }
    }
  });
  if (action.type === "DELETE") {
    // delete uploaded video for the database storage
    admin
      .storage()
      .bucket("chattie-3eb7b.appspot.com/")
      .file(`stories/${action.userId}/${action.payload}`)
      .delete();
  }
};

exports.createReel = async (snapshot, context) => {
  const postCreated = snapshot.data();
  const userId = context.params.userId;
  const postId = context.params.postId;

  // 1) Get all the followers of the user who made the post
  const userFollowersRef = admin
    .firestore()
    .collection("followers")
    .doc(userId)
    .collection("userFollowers");

  const querySnapshot = await userFollowersRef.get();
  // 2) Add new post to each follower's timeline
  querySnapshot.forEach((doc) => {
    const followerId = doc.id;

    admin
      .firestore()
      .collection("timeline")
      .doc(followerId)
      .collection("timelineReels")
      .doc(postId)
      .set(postCreated);
  });
  admin.firestore().collection("allReels").doc(postId).set(postCreated);
  const tags = postCreated.tags;
  if (tags.length > 0) {
    tags.forEach(async (item) => {
      const tagRefGetdoc = await admin
        .firestore()
        .collection("tags")
        .doc(item)
        .get();
      if (tagRefGetdoc.exists) {
        tagRefGetdoc.ref.update({
          postCount: tagRefGetdoc.data().postCount + 1,
        });
      } else {
        admin
          .firestore()
          .collection("tags")
          .doc(item)
          .set({ id: item, postCount: 1 });
      }
      admin
        .firestore()
        .collection("tags")
        .doc(item)
        .collection("tagReels")
        .doc(postId)
        .set(postCreated);
    });
  }
};

exports.updateReel = async (change, context) => {
  const postUpdated = change.after.data();
  const userId = context.params.userId;
  const postId = context.params.postId;

  // 1) Get all the followers of the user who made the post
  const userFollowersRef = admin
    .firestore()
    .collection("followers")
    .doc(userId)
    .collection("userFollowers");

  const querySnapshot = await userFollowersRef.get();
  // 2) Update each post in each follower's timeline
  querySnapshot.forEach(async (doc) => {
    const followerId = doc.id;
    const timelineRefGet = await admin
      .firestore()
      .collection("timeline")
      .doc(followerId)
      .collection("timelineReels")
      .doc(postId)
      .get();
    if (timelineRefGet.exists) {
      timelineRefGet.ref.update(postUpdated);
    }
  });

  const allReelsRefGet = await admin
    .firestore()
    .collection("allReels")
    .doc(postId)
    .get();
  if (allReelsRefGet.exists) {
    allReelsRefGet.ref.update(postUpdated);
  }

  const tags = postUpdated.tags;

  if (tags.length > 0) {
    tags.forEach(async (item) => {
      const tagRefGet = await admin
        .firestore()
        .collection("tags")
        .doc(item)
        .collection("tagReels")
        .doc(postId)
        .get();
      if (tagRefGet.exists) {
        tagRefGet.ref.update(postUpdated);
      }
    });
  }
};

exports.deleteReel = async (snapshot, context) => {
  const userId = context.params.userId;
  const postId = context.params.postId;

  // 1) Get all the followers of the user who made the post
  const userFollowersRef = admin
    .firestore()
    .collection("followers")
    .doc(userId)
    .collection("userFollowers");

  const querySnapshot = await userFollowersRef.get();
  // 2) Delete each post in each follower's timeline
  querySnapshot.forEach(async (doc) => {
    const followerId = doc.id;
    const timelineRefGet = await admin
      .firestore()
      .collection("timeline")
      .doc(followerId)
      .collection("timelineReels")
      .doc(postId)
      .get();
    if (timelineRefGet.exists) {
      timelineRefGet.ref.delete();
    }
  });

  // 3) Delete post from allreels collection
  const allReelsRefGet = await admin
    .firestore()
    .collection("allReels")
    .doc(postId)
    .get();
  if (allReelsRefGet.exists) {
    allReelsRefGet.ref.delete();
  }

  const tags = snapshot.data().tags;

  if (tags.length > 0) {
    tags.forEach(async (item) => {
      const tagRefGet = await admin
        .firestore()
        .collection("tags")
        .doc(item)
        .collection("tagReels")
        .doc(postId)
        .get();
      if (tagRefGet.exists) {
        tagRefGet.ref.delete();
      }

      const tagRefGetdoc = await admin
        .firestore()
        .collection("tags")
        .doc(item)
        .get();
      if (tagRefGetdoc.exists) {
        if (tagRefGetdoc.data().postCount === 1) {
          tagRefGetdoc.ref.delete();
        } else {
          tagRefGetdoc.ref.update({
            postCount: tagRefGetdoc.data().postCount - 1,
          });
        }
      }
    });
  }
  // delete uploaded video for the database storage
  admin
    .storage()
    .bucket("chattie-3eb7b.appspot.com/")
    .file(`reels/${postId}`)
    .delete();

  // then delete all activity feed notifications
  const afRef = await admin
    .firestore()
    .collection("activity_feed")
    .doc(userId)
    .collection("feedItems")
    .where("postId", "==", `${postId}`);
  const activityFeedSnapshot = await afRef.get();

  activityFeedSnapshot.docs.forEach((doc) => {
    if (doc.exists) {
      doc.ref.delete();
    }
  });

  // Delete all comments
  const csRef = admin
    .firestore()
    .collection("comments")
    .doc(postId)
    .collection("comments");
  const commentsSnapshot = await csRef.get();
  commentsSnapshot.docs.forEach((doc) => {
    if (doc.exists) {
      doc.ref.delete();
    }
  });
};
