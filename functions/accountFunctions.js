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
