const admin = require("firebase-admin");

exports.createXStore = async (snapshot, context) => {
  const storeId = context.params.storeId;
  await admin
    .firestore()
    .collection("storeFollowers")
    .doc(storeId)
    .collection("followers")
    .doc(storeId)
    .set({});
};

exports.createStoreFollower = async (snapshot, context) => {
  const storeId = context.params.storeId;
  const followerId = context.params.followerId;
  // 1) Create followed store reels and products ref
  const followedStoreReelsRef = admin
    .firestore()
    .collection("storeReels")
    .doc(storeId)
    .collection("reels");

  const followedStoreProductsRef = admin
    .firestore()
    .collection("products")
    .doc(storeId)
    .collection("my_products");

  // 2) Create following store's timeline and productTimeline ref
  const timelineReelsRef = admin
    .firestore()
    .collection("timeline")
    .doc(followerId)
    .collection("timelineReels");

  const productTimelineRef = admin
    .firestore()
    .collection("productTimeline")
    .doc(followerId)
    .collection("products");

  // 3) Get followed dtore reels and products
  const querySnapshot = await followedStoreReelsRef.get();
  const productQuerySnapshot = await productTimelineRef.get();

  // 4) Add each store post and product to following user's timeline and productTimeline
  querySnapshot.forEach((doc) => {
    if (doc.exists) {
      const postId = doc.id;
      const postData = doc.data();
      timelineReelsRef.doc(postId).set(postData);
    }
  });
  productQuerySnapshot.forEach((doc) => {
    if (doc.exists) {
      const productId = doc.id;
      const productData = doc.data();
      followedStoreProductsRef.doc(productId).set(productData);
    }
  });
};

exports.deleteStoreFollower = async (snapshot, context) => {
  const storeId = context.params.storeId;
  const followerId = context.params.followerId;

  const timelineReelsRef = admin
    .firestore()
    .collection("timeline")
    .doc(followerId)
    .collection("timelineReels")
    .where("storeId", "==", storeId);

  const timelineProductssRef = admin
    .firestore()
    .collection("productTimeline")
    .doc(followerId)
    .collection("products")
    .where("storeId", "==", storeId);

  const querySnapshot = await timelineReelsRef.get();
  const productQuerySnapshot = await timelineProductssRef.get();

  querySnapshot.forEach((doc) => {
    if (doc.exists) {
      doc.ref.delete();
    }
  });

  productQuerySnapshot.forEach((doc) => {
    if (doc.exists) {
      doc.ref.delete();
    }
  });
};

exports.createStoreReel = async (snapshot, context) => {
  const postCreated = snapshot.data();
  const storeId = context.params.storeId;
  const postId = context.params.postId;

  // 1) Get all the followers of the store who made the post
  const storeFollowersRef = admin
    .firestore()
    .collection("storeFollowers")
    .doc(storeId)
    .collection("followers");

  const querySnapshot = await storeFollowersRef.get();

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

exports.updateStoreReel = async (change, context) => {
  const postUpdated = change.after.data();
  const storeId = context.params.storeId;
  const postId = context.params.postId;

  // 1) Get all the followers of the store who made the post
  const storeFollowersRef = admin
    .firestore()
    .collection("storeFollowers")
    .doc(storeId)
    .collection("followers");

  const querySnapshot = await storeFollowersRef.get();

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

exports.deleteStoreReel = async (snapshot, context) => {
  const storeId = context.params.storeId;
  const postId = context.params.postId;

  // 1) Get all the followers of the store who made the post
  const storeFollowersRef = admin
    .firestore()
    .collection("storeFollowers")
    .doc(storeId)
    .collection("followers");

  const querySnapshot = await storeFollowersRef.get();

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
};

exports.createStoreProduct = async (snapshot, context) => {
  const productCreated = snapshot.data();
  const storeId = context.params.storeId;
  const productId = context.params.productId;

  // 1) Get all the followers of the store who made the post
  const storeFollowersRef = admin
    .firestore()
    .collection("storeFollowers")
    .doc(storeId)
    .collection("followers");

  const querySnapshot = await storeFollowersRef.get();

  // 2) Add new product to each follower's productTimeline
  querySnapshot.forEach((doc) => {
    const followerId = doc.id;
    admin
      .firestore()
      .collection("productTimeline")
      .doc(followerId)
      .collection("products")
      .doc(productId)
      .set(productCreated);
  });
  const tags = productCreated.tags;

  if (tags.length > 0) {
    tags.forEach((item) => {
      admin
        .firestore()
        .collection("productTags")
        .doc(item)
        .collection("products")
        .doc(productId)
        .set(productCreated);
    });
  }
};

exports.updateStoreProduct = async (change, context) => {
  const productUpdated = change.after.data();
  const storeId = context.params.storeId;
  const productId = context.params.productId;

  // 1) Get all the followers of the store who made the post
  const storeFollowersRef = admin
    .firestore()
    .collection("storeFollowers")
    .doc(storeId)
    .collection("followers");

  const querySnapshot = await storeFollowersRef.get();

  // 2) Update each post in each follower's timeline
  querySnapshot.forEach(async (doc) => {
    const followerId = doc.id;
    const timelineRefGet = await admin
      .firestore()
      .collection("productTimeline")
      .doc(followerId)
      .collection("products")
      .doc(productId)
      .get();
    if (timelineRefGet.exists) {
      timelineRefGet.ref.update(productUpdated);
    }
  });
  const tags = productUpdated.tags;

  if (tags.length > 0) {
    tags.forEach(async (item) => {
      const tagRefGet = await admin
        .firestore()
        .collection("tags")
        .doc(item)
        .collection("tagReels")
        .doc(productId)
        .get();
      if (tagRefGet.exists) {
        tagRefGet.ref.update(productUpdated);
      }
    });
  }
};

exports.deleteStoreProduct = async (snapshot, context) => {
  const storeId = context.params.storeId;
  const productId = context.params.productId;

  // 1) Get all the followers of the store who made the post
  const storeFollowersRef = admin
    .firestore()
    .collection("storeFollowers")
    .doc(storeId)
    .collection("followers");

  const querySnapshot = await storeFollowersRef.get();

  // 2) Delete each post in each follower's timeline
  querySnapshot.forEach(async (doc) => {
    const followerId = doc.id;
    const timelineRefGet = await admin
      .firestore()
      .collection("productTimeline")
      .doc(followerId)
      .collection("products")
      .doc(productId)
      .get();

    if (timelineRefGet.exists) {
      timelineRefGet.ref.delete();
    }
  });
  const tags = snapshot.before.data().tags;
  if (tags.length > 0) {
    tags.forEach(async (item) => {
      const tagRefGet = await admin
        .firestore()
        .collection("tags")
        .doc(item)
        .collection("tagReels")
        .doc(productId)
        .get();

      if (tagRefGet.exists) {
        tagRefGet.ref.delete();
      }
    });
  }
};
