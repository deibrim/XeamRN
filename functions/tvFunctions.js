const admin = require("firebase-admin");

exports.createTvProfile = async (snapshot, context) => {
  const tvId = context.params.tvId;
  const userRef = firestore.doc(`users/${tvId}`);
  await userRef.update({ isTvActivated: true });
  await admin
    .firestore()
    .collection("tvFollowers")
    .doc(tvId)
    .collection("followers")
    .doc(tvId)
    .set({});
};

exports.deleteTvProfile = async (snapshot, context) => {
  const tvId = context.params.tvId;
  // Refs

  // User
  const userRef = admin.firestore().collection("users").doc(tvId);

  // Posts
  const tvReelsCollectionRef = admin
    .firestore()
    .collection("tvReels")
    .doc(tvId)
    .collection("reels");

  // Followers
  const tvFollowersRef = admin
    .firestore()
    .collection("tvFollowers")
    .doc(tvId)
    .collection("followers");

  await userRef.update({ isTvActivated: false });

  // Deleting Posts
  const tvReelsSnapshot = await tvReelsCollectionRef.get();
  if (tvReelsSnapshot.size > 0) {
    tvReelsSnapshot.forEach((doc) => {
      doc.ref.delete();
    });
  }

  // Delete from Tv followers
  const tvFollowersSnapshot = await tvFollowersRef.get();
  if (tvFollowersSnapshot.size > 0) {
    tvFollowersSnapshot.forEach((doc) => {
      doc.ref.delete();
    });
  }
  // delete uploaded logo for the database storage
  admin
    .storage()
    .bucket("chattie-3eb7b.appspot.com/")
    .file(`tv/${tvId}/tv_logo`)
    .delete();
};

exports.createTvFollower = async (snapshot, context) => {
  const tvId = context.params.tvId;
  const followerId = context.params.followerId;
  // 1) Create followed tv reels ref
  const followedTvReelsRef = admin
    .firestore()
    .collection("tvReels")
    .doc(tvId)
    .collection("reels");

  // 2) Create following tv's timeline ref
  const timelineReelsRef = admin
    .firestore()
    .collection("timeline")
    .doc(followerId)
    .collection("timelineReels");

  // 3) Get followed tv reels
  const querySnapshot = await followedTvReelsRef.get();

  // 4) Add each tv post to following user's timeline
  querySnapshot.forEach((doc) => {
    if (doc.exists) {
      const postId = doc.id;
      const postData = doc.data();
      timelineReelsRef.doc(postId).set(postData);
    }
  });
};

exports.deleteTvFollower = async (snapshot, context) => {
  const tvId = context.params.tvId;
  const followerId = context.params.followerId;

  const timelinePostsRef = admin
    .firestore()
    .collection("timeline")
    .doc(followerId)
    .collection("timelineReels")
    .where("tvId", "==", tvId);

  const querySnapshot = await timelinePostsRef.get();
  querySnapshot.forEach((doc) => {
    if (doc.exists) {
      doc.ref.delete();
    }
  });
};

exports.createTvStory = async (snapshot, context) => {
  const postCreated = snapshot.data();
  const tvId = context.params.tvId;

  // 1) Get all the followers of the tv who made the post
  const tvFollowersRef = admin
    .firestore()
    .collection("tvFollowers")
    .doc(tvId)
    .collection("followers");

  const querySnapshot = await tvFollowersRef.get();

  // 2) Add new post to each follower's timeline
  querySnapshot.forEach((doc) => {
    const followerId = doc.id;

    admin
      .firestore()
      .collection("stories")
      .doc(followerId)
      .collection("stories")
      .doc(tvId)
      .set(postCreated);
  });
};

exports.updateTvStory = async (change, context) => {
  const postUpdated = change.after.data();
  const action = change.after.data().action;
  const tvId = context.params.tvId;

  // 1) Get all the followers of the tv who made the post
  const tvFollowersRef = admin
    .firestore()
    .collection("tvFollowers")
    .doc(tvId)
    .collection("followers");

  const querySnapshot = await tvFollowersRef.get();

  // 2) Update each post in each follower's timeline
  querySnapshot.forEach(async (doc) => {
    const followerId = doc.id;
    const storiesRefGet = await admin
      .firestore()
      .collection("stories")
      .doc(followerId)
      .collection("stories")
      .doc(tvId)
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

exports.createTvReel = async (snapshot, context) => {
  const postCreated = snapshot.data();
  const tvId = context.params.tvId;
  const postId = context.params.postId;

  // 1) Get all the followers of the tv who made the post
  const tvFollowersRef = admin
    .firestore()
    .collection("tvFollowers")
    .doc(tvId)
    .collection("followers");

  const querySnapshot = await tvFollowersRef.get();

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

exports.updateTvReel = async (change, context) => {
  const postUpdated = change.after.data();
  const tvId = context.params.tvId;
  const postId = context.params.postId;

  // 1) Get all the followers of the tv who made the post
  const tvFollowersRef = admin
    .firestore()
    .collection("tvFollowers")
    .doc(tvId)
    .collection("followers");

  const querySnapshot = await tvFollowersRef.get();

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

  if (tags.lenght > 0) {
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

exports.deleteTvReel = async (snapshot, context) => {
  const tvId = context.params.tvId;
  const postId = context.params.postId;

  // 1) Get all the followers of the tv who made the post
  const tvFollowersRef = admin
    .firestore()
    .collection("tvFollowers")
    .doc(tvId)
    .collection("followers");

  const querySnapshot = await tvFollowersRef.get();

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
