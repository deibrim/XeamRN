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
exports.deleteXStore = async (snapshot, context) => {
  const storeId = context.params.storeId;

  // Refs
  // User
  const userRef = admin.firestore().collection("users").doc(storeId);
  // Posts
  const storeReelsCollectionRef = admin
    .firestore()
    .collection("storeReels")
    .doc(storeId)
    .collection("reels");
  // Products
  const storeProductsCollectionRef = admin
    .firestore()
    .collection("products")
    .doc(storeId)
    .collection("my_products");
  const storeProductsTimelineCollectionRef = admin
    .firestore()
    .collection("productTimeline")
    .doc(storeId)
    .collection("products");

  // Followers
  const storeFollowersRef = admin
    .firestore()
    .collection("storeFollowers")
    .doc(storeId)
    .collection("followers");

  const userSnapshot = await userRef.get();
  if (userSnapshot.exists) {
    await userRef.update({ isBusinessAccount: false });
  }

  // Deleting Posts
  const storeReelsSnapshot = await storeReelsCollectionRef.get();
  if (storeReelsSnapshot.size > 0) {
    storeReelsSnapshot.forEach((doc) => {
      doc.ref.delete();
    });
  }
  // Deleting Products
  const storeProductsSnapshot = await storeProductsCollectionRef.get();
  if (storeProductsSnapshot.size > 0) {
    storeProductsSnapshot.forEach((doc) => {
      doc.ref.delete();
    });
  }
  const storeProductsTimelineSnapshot = await storeProductsTimelineCollectionRef.get();
  if (storeProductsTimelineSnapshot.size > 0) {
    storeProductsTimelineSnapshot.forEach((doc) => {
      doc.ref.delete();
    });
  }

  // Delete from Store followers
  const storeFollowersSnapshot = await storeFollowersRef.get();
  if (storeFollowersSnapshot.size > 0) {
    storeFollowersSnapshot.forEach((doc) => {
      doc.ref.delete();
    });
  }
  // delete uploaded video for the database storage
  admin
    .storage()
    .bucket("chattie-3eb7b.appspot.com/")
    .file(`xeamStores/${storeId}/store_logo`)
    .delete();
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

  // 3) Get followed store reels and products
  const querySnapshot = await followedStoreReelsRef.get();
  const productQuerySnapshot = await followedStoreProductsRef.get();

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
      productTimelineRef.doc(productId).set(productData);
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

  admin
    .firestore()
    .collection("allProducts")
    .doc(productId)
    .set(productCreated);

  // const tags = productCreated.tags;

  // if (tags.length > 0) {
  //   tags.forEach(async (item) => {
  //     const tagRefGetdoc = await admin
  //       .firestore()
  //       .collection("productTags")
  //       .doc(item)
  //       .get();
  //     if (tagRefGetdoc.exists) {
  //       tagRefGetdoc.ref.update({
  //         productCount: tagRefGetdoc.data().productCount + 1,
  //       });
  //     } else {
  //       admin
  //         .firestore()
  //         .collection("productTags")
  //         .doc(item)
  //         .set({ id: item, productCount: 1 });
  //     }
  //     admin
  //       .firestore()
  //       .collection("productTags")
  //       .doc(item)
  //       .collection("products")
  //       .doc(productId)
  //       .set(productCreated);
  //   });
  // }
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

  const allProductRefGet = await admin
    .firestore()
    .collection("allProducts")
    .doc(productId)
    .get();
  if (allProductRefGet.exists) {
    allProductRefGet.ref.update(productUpdated);
  }

  // const tags = productUpdated.tags;

  // if (tags.length > 0) {
  //   tags.forEach(async (item) => {
  //     const tagRefGet = await admin
  //       .firestore()
  //       .collection("productTags")
  //       .doc(item)
  //       .collection("products")
  //       .doc(productId)
  //       .get();
  //     if (tagRefGet.exists) {
  //       tagRefGet.ref.update(productUpdated);
  //     }
  //   });
  // }
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

  // 3) Delete post from allreels collection
  const allProductRefGet = await admin
    .firestore()
    .collection("allProducts")
    .doc(productId)
    .get();
  if (allProductRefGet.exists) {
    allProductRefGet.ref.delete();
  }

  // const tags = snapshot.data().tags;

  // if (tags.length > 0) {
  //   tags.forEach(async (item) => {
  //     const tagRefGet = await admin
  //       .firestore()
  //       .collection("productTags")
  //       .doc(item)
  //       .collection("products")
  //       .doc(productId)
  //       .get();

  //     if (tagRefGet.exists) {
  //       tagRefGet.ref.delete();
  //     }
  //     const tagRefGetdoc = await admin
  //       .firestore()
  //       .collection("productTags")
  //       .doc(item)
  //       .get();
  //     if (tagRefGetdoc.exists) {
  //       if (tagRefGetdoc.data().productCount === 1) {
  //         tagRefGetdoc.ref.delete();
  //       } else {
  //         tagRefGetdoc.ref.update({
  //           productCount: tagRefGetdoc.data().productCount - 1,
  //         });
  //       }
  //     }
  //   });
  // }
  // delete uploaded video for the database storage
  snapshot.data().images.forEach((item, index) => {
    admin
      .storage()
      .bucket("chattie-3eb7b.appspot.com/")
      .file(`products/${productId}/${index}`)
      .delete();
  });

  // then delete all activity feed notifications
  // const afRef = await admin
  //   .firestore()
  //   .collection("activity_feed")
  //   .doc(userId)
  //   .collection("feedItems")
  //   .where("productId", "==", `${productId}`);
  // const activityFeedSnapshot = await afRef.get();

  // activityFeedSnapshot.docs.forEach((doc) => {
  //   if (doc.exists) {
  //     doc.ref.delete();
  //   }
  // });

  // Delete all comments
  const commentsRef = admin
    .firestore()
    .collection("productComments")
    .doc(productId)
    .collection("comments");
  const commentsSnapshot = await commentsRef.get();
  commentsSnapshot.docs.forEach((doc) => {
    if (doc.exists) {
      doc.ref.delete();
    }
  });
  const productQuestionRef = admin
    .firestore()
    .collection("productQuestions")
    .doc(productId)
    .collection("questions");
  const questionsSnapshot = await productQuestionRef.get();
  questionsSnapshot.docs.forEach((doc) => {
    if (doc.exists) {
      doc.ref.delete();
    }
  });
};
