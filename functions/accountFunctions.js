exports.createFollower = async (snapshot, context) => {
  const userId = context.params.userId;
  const followerId = context.params.followerId;
  // 1) Create followed users reels ref
  const followedUserReelsRef = admin
    .firestore()
    .collection("reels")
    .doc(userId)
    .collection("userReels");
  const followedUserRef = admin.firestore().collection("users").doc(userId);
  const followerUserRef = admin.firestore().collection("users").doc(followerId);

  const followedSnapShot = await followedUserRef.get();
  const followerSnapShot = await followerUserRef.get();

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
  postCreated.tags.forEach((item) => {
    admin
      .firestore()
      .collection("tags")
      .doc(item)
      .collection("tagReels")
      .doc(postId)
      .set(postCreated);
  });
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
    postUpdated.tags.forEach(item =>{
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
    })
  }

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
    snapshot.before.data().tags.forEach(item =>{
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
    })
  }
  
  
